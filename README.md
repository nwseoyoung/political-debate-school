# 정치토론학교 - 모집 웹사이트

이념을 넘어, 논리로 만나는 공간

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 프로젝트 소개

정치토론학교는 대학생 이상 성인을 대상으로 한 정치 토론 교육 프로그램의 모집 웹사이트입니다.

**핵심 가치:**
- 초당적 구성 - 다양한 정치 성향의 참가자들이 함께 학습
- 토론 기술 중심 교육
- 6주 단기 집중 온라인 과정

---

## 🚀 기술 스택

### Frontend
- HTML5
- CSS3 (반응형 디자인)
- Vanilla JavaScript

### Backend
- Vercel Serverless Functions (Node.js)
- Supabase (PostgreSQL)

### 배포
- Vercel (호스팅)
- Supabase (데이터베이스)

---

## 📁 프로젝트 구조

```
vibe_test/
├── index.html              # 메인 모집 페이지
├── application.html        # 지원서 작성 페이지
├── styles.css              # 전체 스타일시트
├── script.js               # 클라이언트 JavaScript
├── api/
│   ├── submit-application.js  # 지원서 제출 API
│   └── get-stats.js           # 통계 조회 API
├── supabase_schema.sql     # 데이터베이스 스키마
├── vercel.json             # Vercel 설정
├── package.json            # 의존성 관리
├── .env.example            # 환경 변수 예시
├── .gitignore              # Git 제외 파일
├── DEPLOYMENT_GUIDE.md     # 배포 가이드
└── README.md               # 프로젝트 문서
```

---

## 🛠️ 로컬 개발 환경 설정

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/political-debate-school.git
cd political-debate-school
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일 내용 수정:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=development
```

### 4. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase_schema.sql` 실행
3. API 키 복사하여 `.env`에 붙여넣기

### 5. 로컬 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 📊 주요 기능

### 모집 페이지 (index.html)

- **히어로 섹션**: 프로그램 소개 및 CTA
- **문제 제기**: 현재 정치 토론의 문제점
- **핵심 가치**: 논리적 사고력, 경청과 공감, 건설적 토론
- **차별화 포인트**: 초당적 구성 강조
- **커리큘럼**: 6주 과정 상세 내용 (탭 UI)
- **FAQ**: 자주 묻는 질문 (아코디언 UI)
- **모집 요강**: 일정, 비용, 선발 기준

### 지원서 페이지 (application.html)

- **기본 정보**: 이름, 연령대, 이메일, 연락처 등
- **정치적 성향**: 진보/중도/보수 선택
- **경험과 동기**: 토론 경험, 지원 동기, 기대사항
- **관심 주제**: 토론하고 싶은 정치 이슈 (최대 3개)
- **추가 정보**: 추천인, 유입 경로 등
- **폼 검증**: 실시간 유효성 검사
- **글자 수 카운터**: 동기/기대사항 입력 시

### API 엔드포인트

#### POST /api/submit-application
지원서를 제출하고 Supabase에 저장합니다.

**Request Body:**
```json
{
  "name": "홍길동",
  "age": "20대",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "orientation": "중도",
  "motivation": "지원 동기...",
  "expectations": "기대하는 점..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "지원서가 성공적으로 제출되었습니다.",
  "applicationId": "uuid"
}
```

#### GET /api/get-stats
지원서 통계 및 다양성 점수를 조회합니다.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_applications": 42,
      "pending_count": 30,
      "accepted_count": 10,
      "progressive_count": 15,
      "moderate_count": 12,
      "conservative_count": 15
    },
    "diversity": {
      "progressive_ratio": 0.36,
      "moderate_ratio": 0.29,
      "conservative_ratio": 0.36,
      "diversity_score": 0.99
    }
  }
}
```

---

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary**: `#2C3E50` (네이비 블루)
- **Secondary**: `#F39C12` (골드)
- **Accent**: `#667eea`, `#764ba2` (그라데이션)
- **Background**: `#f8f9fa` (라이트 그레이)
- **Text**: `#333` (다크 그레이)

### 타이포그래피

- **폰트**: Noto Sans KR (Google Fonts)
- **제목**: 900 weight
- **부제목**: 700 weight
- **본문**: 400 weight

---

## 📱 반응형 디자인

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: ~ 767px

모든 페이지는 모바일 퍼스트 디자인으로 제작되었습니다.

---

## 🔒 보안

- **Row Level Security (RLS)**: Supabase에서 활성화
- **환경 변수**: 민감한 정보는 `.env`에 저장
- **HTTPS**: Vercel 자동 SSL 인증서
- **입력 검증**: 클라이언트 및 서버 양측에서 검증
- **SQL Injection 방지**: Supabase 파라미터화된 쿼리

---

## 📈 데이터베이스 스키마

### applications 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본 키 |
| created_at | TIMESTAMP | 생성 시간 |
| name | VARCHAR(100) | 이름 |
| age_range | VARCHAR(20) | 연령대 |
| email | VARCHAR(255) | 이메일 |
| phone | VARCHAR(20) | 연락처 |
| political_orientation | VARCHAR(50) | 정치 성향 |
| motivation | TEXT | 지원 동기 |
| expectations | TEXT | 기대사항 |
| topics | JSONB | 관심 주제 배열 |
| status | VARCHAR(20) | 심사 상태 |

전체 스키마는 `supabase_schema.sql` 참고

---

## 🚀 배포

자세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

### 간단 요약

1. **GitHub에 푸시**
   ```bash
   git push origin main
   ```

2. **Vercel에서 Import**
   - GitHub 저장소 연결
   - 환경 변수 설정
   - 배포

3. **Supabase 설정**
   - 프로젝트 생성
   - SQL 스키마 실행

---

## 🧪 테스트

### 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
open http://localhost:3000
```

### API 테스트

```bash
# 지원서 제출 테스트
curl -X POST http://localhost:3000/api/submit-application \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

---

## 📝 할 일 목록

### 단기 (v1.1)
- [ ] 이메일 자동 발송 (Supabase Edge Functions)
- [ ] 관리자 대시보드 구축
- [ ] Google Analytics 연동

### 중기 (v1.2)
- [ ] 결제 시스템 연동 (Stripe/Toss Payments)
- [ ] 수료생 후기 섹션
- [ ] 블로그/뉴스 섹션

### 장기 (v2.0)
- [ ] 학습 관리 시스템 (LMS)
- [ ] 화상 토론 플랫폼 연동
- [ ] 모바일 앱 개발

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

This project is licensed under the MIT License.

---

## 📞 문의

- 이메일: info@politicaldebate.kr
- 웹사이트: https://your-domain.com
- GitHub Issues: [이슈 제기](https://github.com/YOUR_USERNAME/political-debate-school/issues)

---

## 🙏 감사의 말

- [Vercel](https://vercel.com) - 무료 호스팅
- [Supabase](https://supabase.com) - 오픈소스 Firebase 대안
- [Google Fonts](https://fonts.google.com) - Noto Sans KR

---

**Made with ❤️ for better political discourse**

마지막 업데이트: 2025-10-16
