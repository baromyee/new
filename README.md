# 농구 선수 기록

Google 로그인 후 팀·선수를 등록하고, 경기마다 스탯을 기록하며 전 경기 평균을 보는 사이트입니다.

## 1. 계정 준비

### Clerk (Google 로그인)

1. [Clerk Dashboard](https://dashboard.clerk.com)에서 애플리케이션을 만듭니다.
2. **User & Authentication → Social connections**에서 **Google**을 켭니다.
3. 가능하면 Email/Password는 끕니다.
4. API Keys에서 Publishable Key와 Secret Key를 복사합니다.

### Neon (PostgreSQL)

1. [Neon](https://neon.tech)에서 프로젝트를 만듭니다.
2. Connection string을 복사합니다.

## 2. 환경 변수

`.env.example`을 참고해 `.env` 또는 `.env.local`을 채웁니다.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
```

Clerk 대시보드의 Allowed redirect URLs에 `http://localhost:3000/sign-in`과 `http://localhost:3000/sign-up`을 넣습니다.

## 3. 실행

```bash
npm install
npx prisma db push
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.
