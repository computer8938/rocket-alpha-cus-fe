# Rocket Alpha Customer Frontend

`C:\rocket-alpha-cus-fe`는 사용자용 FE 애플리케이션 서비스다.

역할:
- 국내 뉴스 제공
- 해외 뉴스 제공
- 국내 주식 관련 뉴스/정보 제공
- SMS / Email 알림 서비스 UI 제공

## 기술 스택

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Docker + Nginx
- Capacitor 준비 구조

## 경로와 배포

- 로컬 프로젝트 경로: `C:\rocket-alpha-cus-fe`
- 게이트웨이 기본 노출 경로: `/`

## Node 버전

- Node 22.x

```powershell
cd C:\rocket-alpha-cus-fe
nvm use 22.22.2
```

## 주요 메뉴

- 홈
- 국내 뉴스
- 해외 뉴스
- 주식 정보
- 알림 서비스

## 실행

```powershell
cd C:\rocket-alpha-cus-fe
docker compose up -d --build
```

이 앱은 호스트 포트를 직접 열지 않고, `rocket-gw`를 통해 `/` 경로로 서비스된다.
