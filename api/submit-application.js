import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to validate phone
function isValidPhone(phone) {
    const phoneRegex = /^[0-9-+() ]+$/;
    return phoneRegex.test(phone);
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const data = req.body;

        // Validate required fields
        const requiredFields = ['name', 'age', 'email', 'phone', 'orientation', 'motivation', 'expectations'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: '필수 항목을 모두 입력해주세요.',
                missingFields
            });
        }

        // Validate email format
        if (!isValidEmail(data.email)) {
            return res.status(400).json({
                success: false,
                error: '올바른 이메일 형식이 아닙니다.'
            });
        }

        // Validate phone format
        if (!isValidPhone(data.phone)) {
            return res.status(400).json({
                success: false,
                error: '올바른 전화번호 형식이 아닙니다.'
            });
        }

        // Check if email already exists
        const { data: existingApplications, error: checkError } = await supabase
            .from('applications')
            .select('id')
            .eq('email', data.email)
            .limit(1);

        if (checkError) {
            console.error('Error checking existing application:', checkError);
            return res.status(500).json({
                success: false,
                error: '데이터베이스 조회 중 오류가 발생했습니다.'
            });
        }

        if (existingApplications && existingApplications.length > 0) {
            return res.status(409).json({
                success: false,
                error: '이미 지원하신 이메일 주소입니다.'
            });
        }

        // Prepare data for insertion
        const applicationData = {
            name: data.name.trim(),
            age_range: data.age,
            email: data.email.trim().toLowerCase(),
            phone: data.phone.trim(),
            occupation: data.occupation?.trim() || null,
            location: data.location?.trim() || null,
            political_orientation: data.orientation,
            orientation_description: data['orientation-desc']?.trim() || null,
            debate_experience: data['debate-experience'] || null,
            experience_detail: data['experience-detail']?.trim() || null,
            motivation: data.motivation.trim(),
            expectations: data.expectations.trim(),
            topics: data.topics ? JSON.parse(JSON.stringify(data.topics)) : null,
            weakness: data.weakness?.trim() || null,
            referrer: data.referrer?.trim() || null,
            how_found: data['how-found'] || null,
            additional_notes: data.additional?.trim() || null,
            status: 'pending',
            ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress || null,
            user_agent: req.headers['user-agent'] || null
        };

        // Insert into Supabase
        const { data: insertedData, error: insertError } = await supabase
            .from('applications')
            .insert([applicationData])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting application:', insertError);
            return res.status(500).json({
                success: false,
                error: '지원서 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            });
        }

        // Success response
        return res.status(201).json({
            success: true,
            message: '지원서가 성공적으로 제출되었습니다.',
            applicationId: insertedData.id
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({
            success: false,
            error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
    }
}
