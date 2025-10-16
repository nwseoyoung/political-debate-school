import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Get application statistics
        const { data: stats, error: statsError } = await supabase
            .from('application_stats')
            .select('*')
            .single();

        if (statsError) {
            console.error('Error fetching stats:', statsError);
            return res.status(500).json({
                success: false,
                error: '통계 조회 중 오류가 발생했습니다.'
            });
        }

        // Get diversity score
        const { data: diversity, error: diversityError } = await supabase
            .rpc('calculate_diversity_score');

        if (diversityError) {
            console.error('Error calculating diversity:', diversityError);
        }

        // Return combined statistics
        return res.status(200).json({
            success: true,
            data: {
                stats,
                diversity: diversity && diversity.length > 0 ? diversity[0] : null
            }
        });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({
            success: false,
            error: '서버 오류가 발생했습니다.'
        });
    }
}
