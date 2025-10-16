// Toss Payments 결제 승인 API
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R'; // 테스트 시크릿 키

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
        const { paymentKey, orderId, amount } = req.body;

        // Validate required fields
        if (!paymentKey || !orderId || !amount) {
            return res.status(400).json({
                success: false,
                error: '필수 파라미터가 누락되었습니다.'
            });
        }

        // Toss Payments API로 결제 승인 요청
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount: parseInt(amount)
            })
        });

        const paymentData = await response.json();

        if (!response.ok) {
            console.error('결제 승인 실패:', paymentData);
            return res.status(response.status).json({
                success: false,
                error: paymentData.message || '결제 승인에 실패했습니다.'
            });
        }

        // 결제 성공 - 데이터베이스에 저장 (선택사항)
        // TODO: Supabase에 결제 정보 저장

        // 성공 응답
        return res.status(200).json({
            success: true,
            message: '결제가 승인되었습니다.',
            orderId: paymentData.orderId,
            amount: paymentData.totalAmount,
            method: paymentData.method,
            approvedAt: paymentData.approvedAt
        });

    } catch (error) {
        console.error('결제 승인 중 오류:', error);
        return res.status(500).json({
            success: false,
            error: '서버 오류가 발생했습니다.'
        });
    }
}
