# 정치토론학교 - 배포 가이드

Vercel과 Supabase를 사용하여 정치토론학교 웹사이트를 배포하는 방법입니다.

---

## 📋 목차

1. [사전 준비](#사전-준비)
2. [Supabase 설정](#supabase-설정)
3. [Vercel 배포](#vercel-배포)
4. [환경 변수 설정](#환경-변수-설정)
5. [배포 후 확인](#배포-후-확인)
6. [추가 설정](#추가-설정)

---

## 사전 준비

### 필요한 계정
- GitHub 계정 (코드 저장소용)
- Supabase 계정 (데이터베이스용)
- Vercel 계정 (호스팅용)

### 설치 필요
```bash
# Node.js 18.x 이상 설치 필요
node --version  # 확인

# npm 또는 yarn 설치 확인
npm --version
```

---

## 1단계: GitHub 저장소 생성

### 1. 로컬 프로젝트 초기화

```bash
cd /Users/nwseoyoung/vibe_test

# Git 초기화
git init

# 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Political Debate School website"
```

### 2. GitHub에 저장소 생성

1. GitHub (https://github.com) 접속
2. 우측 상단 "+" 버튼 클릭 → "New repository"
3. Repository 이름: `political-debate-school` (또는 원하는 이름)
4. Public 또는 Private 선택
5. "Create repository" 클릭

### 3. 로컬 저장소를 GitHub에 푸시

```bash
# GitHub 저장소 주소로 변경
git remote add origin https://github.com/YOUR_USERNAME/political-debate-school.git

# 푸시
git branch -M main
git push -u origin main
```

---

## 2단계: Supabase 설정

### 1. Supabase 프로젝트 생성

1. Supabase (https://supabase.com) 접속
2. "Start your project" 클릭
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - Name: `political-debate-school`
   - Database Password: **강력한 비밀번호 설정** (반드시 저장하세요!)
   - Region: `Northeast Asia (Seoul)` 선택 (한국 사용자용)
5. "Create new project" 클릭 (1-2분 소요)

### 2. 데이터베이스 스키마 생성

1. 좌측 메뉴에서 "SQL Editor" 클릭
2. "New query" 클릭
3. `supabase_schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭 (또는 Ctrl/Cmd + Enter)
5. 성공 메시지 확인: "Success. No rows returned"

### 3. Row Level Security (RLS) 확인

1. 좌측 메뉴에서 "Authentication" → "Policies" 클릭
2. `applications` 테이블에 다음 정책이 있는지 확인:
   - "Allow public to insert applications" (INSERT 허용)
   - "Allow authenticated users to view applications" (SELECT 허용)
   - "Allow authenticated users to update applications" (UPDATE 허용)

### 4. API 키 확인

1. 좌측 메뉴에서 "Settings" → "API" 클릭
2. 다음 정보 복사 (나중에 사용):
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (긴 문자열)
   - **service_role key**: `eyJhbGc...` (긴 문자열, **절대 노출 금지!**)

---

## 3단계: Vercel 배포

### 1. Vercel 계정 생성 및 프로젝트 연결

1. Vercel (https://vercel.com) 접속
2. "Start Deploying" 또는 "Sign Up" 클릭
3. GitHub 계정으로 로그인
4. "Import Project" 클릭
5. GitHub 저장소 `political-debate-school` 선택
6. "Import" 클릭

### 2. 프로젝트 설정

**Build & Development Settings:**
- Framework Preset: `Other`
- Build Command: 비워두기 (정적 사이트)
- Output Directory: `.` (현재 디렉토리)
- Install Command: `npm install`

### 3. 환경 변수 설정 (중요!)

"Environment Variables" 섹션에서 다음 변수 추가:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=production
```

**값 입력 방법:**
1. `SUPABASE_URL`: Supabase 프로젝트 URL 붙여넣기
2. `SUPABASE_ANON_KEY`: anon public key 붙여넣기
3. `SUPABASE_SERVICE_ROLE_KEY`: service_role key 붙여넣기
4. `NODE_ENV`: `production` 입력

**중요**: 모든 환경에서 사용하려면 "Production", "Preview", "Development" 모두 체크!

### 4. 배포 시작

1. "Deploy" 버튼 클릭
2. 배포 진행 상황 확인 (1-2분 소요)
3. 배포 완료 후 URL 확인: `https://your-project.vercel.app`

---

## 4단계: 배포 후 확인

### 1. 웹사이트 접속 테스트

1. Vercel에서 제공한 URL로 접속
2. 메인 페이지가 정상적으로 로드되는지 확인
3. 네비게이션 메뉴 클릭 테스트
4. 커리큘럼 탭, FAQ 아코디언 동작 확인

### 2. 지원서 제출 테스트

1. "지금 신청하기" 버튼 클릭
2. 지원서 양식 작성
3. "지원서 제출하기" 버튼 클릭
4. 성공 메시지 확인

### 3. 데이터베이스 확인

1. Supabase 대시보드 → "Table Editor" 클릭
2. `applications` 테이블 선택
3. 방금 제출한 데이터가 들어있는지 확인

### 4. API 엔드포인트 테스트

```bash
# 지원서 제출 API 테스트
curl -X POST https://your-project.vercel.app/api/submit-application \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트",
    "age": "20대",
    "email": "test@example.com",
    "phone": "010-1234-5678",
    "orientation": "중도",
    "motivation": "테스트입니다.",
    "expectations": "테스트입니다."
  }'

# 통계 API 테스트
curl https://your-project.vercel.app/api/get-stats
```

---

## 5단계: 추가 설정

### 커스텀 도메인 연결 (선택사항)

1. Vercel 프로젝트 대시보드 → "Settings" → "Domains"
2. "Add" 버튼 클릭
3. 보유한 도메인 입력 (예: `politicaldebate.kr`)
4. DNS 설정 지침 따라하기:
   - A 레코드: `76.76.21.21`
   - CNAME 레코드: `cname.vercel-dns.com`
5. DNS 전파 대기 (최대 48시간)

### SSL/HTTPS 설정

Vercel은 자동으로 SSL 인증서를 발급하고 HTTPS를 활성화합니다.
별도 설정이 필요 없습니다!

### 자동 배포 설정

GitHub 저장소에 푸시하면 자동으로 Vercel에 배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update content"
git push origin main

# Vercel이 자동으로 배포 시작!
```

---

## 문제 해결

### 배포 실패 시

1. Vercel 배포 로그 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. `package.json`이 저장소에 포함되어 있는지 확인

### API 오류 시

1. Vercel "Functions" 탭에서 로그 확인
2. Supabase API 키가 올바른지 확인
3. Supabase 프로젝트가 일시 중지되지 않았는지 확인

### 데이터베이스 연결 오류

1. Supabase 프로젝트 상태 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. API 키가 만료되지 않았는지 확인

### CORS 오류

`vercel.json` 파일에 CORS 헤더가 올바르게 설정되어 있는지 확인:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

---

## 관리 및 모니터링

### 지원서 확인하기

1. Supabase 대시보드 → "Table Editor"
2. `applications` 테이블에서 지원서 목록 확인
3. 필터링 및 정렬 가능

### 통계 보기

```bash
# API로 통계 확인
curl https://your-project.vercel.app/api/get-stats
```

### 백업 설정

Supabase는 자동 백업을 제공하지만, 추가 백업 권장:

1. Supabase 대시보드 → "Database" → "Backups"
2. 수동 백업: "Create backup" 클릭
3. 자동 백업 일정 설정 (Pro 플랜)

---

## 비용 안내

### Vercel
- **Hobby 플랜** (무료):
  - 무제한 배포
  - 100GB 대역폭/월
  - 서버리스 함수 100시간/월

- **Pro 플랜** ($20/월):
  - 1TB 대역폭
  - 무제한 서버리스 함수 실행

### Supabase
- **Free 플랜** (무료):
  - 500MB 데이터베이스
  - 1GB 파일 저장소
  - 50,000 월간 활성 사용자

- **Pro 플랜** ($25/월):
  - 8GB 데이터베이스
  - 100GB 파일 저장소
  - 100,000 월간 활성 사용자

**추천**: 초기에는 무료 플랜으로 충분합니다!

---

## 체크리스트

배포 전 확인사항:

- [ ] GitHub 저장소 생성 및 코드 푸시
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 실행
- [ ] Supabase API 키 확인
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 완료
- [ ] 웹사이트 접속 테스트
- [ ] 지원서 제출 테스트
- [ ] 데이터베이스 데이터 확인

---

## 다음 단계

배포가 완료되었다면:

1. **이메일 알림 설정**: Supabase Edge Functions로 자동 이메일 발송
2. **관리자 대시보드 구축**: 지원서 관리 페이지 개발
3. **분석 도구 연동**: Google Analytics 또는 Vercel Analytics
4. **SEO 최적화**: 메타 태그, sitemap.xml 추가
5. **성능 모니터링**: Vercel Speed Insights 활성화

---

## 도움이 필요하신가요?

- Vercel 문서: https://vercel.com/docs
- Supabase 문서: https://supabase.com/docs
- 이슈 제기: GitHub Issues 탭

---

**배포 성공을 기원합니다! 🚀**

작성일: 2025-10-16
버전: 1.0
