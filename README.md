# Rocket Alpha Customer Frontend

`C:\rocket-alpha-cus-fe`는 Rocket Alpha 고객용 Vue SPA다.

## 역할

- 고객 홈
- 국내 뉴스 / 해외 뉴스 / 시장 정보
- 알림 서비스 UI
- 인증 후 고객 전용 화면 제공

## 기술 스택

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Docker + Nginx
- `rocket-alpha-ui` 공유 패키지 사용

## 현재 포트 체계

- Vite dev: `http://localhost:4761`
- Vite preview: `http://localhost:4861`
- Gateway 경유: `http://localhost:4760/`

## 프록시 대상

- Auth direct: `http://localhost:4763`
- Scraper API direct: `http://localhost:4764`
- Processor API direct: `http://localhost:4765`
- Customer API direct: `http://localhost:4768`

## 개별 기동

```powershell
cd C:\rocket-alpha-cus-fe
.\start.ps1
```

중지:

```powershell
.\stop.ps1
```

## 수동 기동

```powershell
docker compose up -d --build
```

## 서비스 재기동 순서

| 순서 | 선행 대상 | 현재 패키지 위치 |
|---|---|---|
| 1 | `C:\rocket-alpha` 데이터/백엔드 스택 | customer API 포함 |
| 2 | `C:\rocket-auth` | 로그인/세션 의존 |
| 3 | `C:\rocket-alpha-cus-fe` | 현재 패키지 |
| 4 | `C:\rocket-gw` | 통합 루트 `/` 확인 시 마지막 |

개별 재기동:

```powershell
cd C:\rocket-alpha-cus-fe
.\stop.ps1
.\start.ps1
```

## 개발 모드

```powershell
npm install
npm run typecheck
npm run dev
```

## 비고

- 이 패키지는 배포 시 gateway 루트(`/`)에 매핑된다.
- 로컬 dev는 `4761`, 통합 테스트는 gateway `4760` 기준으로 확인한다.
