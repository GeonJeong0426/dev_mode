<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/50824e8a-a125-4a48-aaad-b40ea2d8ffa5">

# REWARD5 포인트 적립 서비스

### 📖 프로젝트 개요
블록체인 기술을 사용하여 포인트 적립 및 사용 서비스를 만들면 거래 내역과 사용 내역들이 기록에 남는다는 점이 매력이 있어 계획.
<br/><br/>

### 🚀 프로젝트 목표
- 체인코드를 통해 회원가입, 추천인 등록, 결제 및 적립, 포인트 거래, 이벤트 등을 구현
- 클라이언트를 REACT 프레임워크를 사용하고 REST API를 통한 API 통신
- API 통신을 통해 가져온 데이터를 프론트에서 보여주도록 설계
<br/><br/><br/>

## 📝 프로젝트 설명

### 💼 REWARD5의 기능
1. 회원가입과 추천인 등록을 통한 포인트 적립
2. 결제를 통한 포인트 적립
3. 유저 간 포인트 거래 기능
4. 로또 이벤트를 통한 재미 제공
5. 한눈에 보이는 포인트 잔액 정보 확인
<br/><br/>

### 🗺 기술 설계도
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/b46445cc-97ab-4af1-a1a9-07443e14f6c6"><br/><br/>


### 💻 기술 스택
- **OS:** &nbsp;&nbsp;![Windows 11](https://img.shields.io/badge/Windows%2011-%230079d5.svg?style=for-the-badge&logo=Windows%2011&logoColor=white) ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
- **Container 배포:** &nbsp;&nbsp;![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
- **FrameWork:** &nbsp;&nbsp;![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB ) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- **Style:** &nbsp;&nbsp;![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
- **Language:** &nbsp;&nbsp;![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
- **Tools:** &nbsp;&nbsp;![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
<br/><br/>


### ✨ 주요 기능 및 이미지
📌 Home<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/4899a646-3abc-4837-927d-1002c53329a8"><br/><br/>
- **메뉴바:** 로고와 각종 기능들을 이용할 수 있는 메뉴 바 구현<br/>
- **광고:** 사용자에게 어떻게 사용하는지와 사용하고 싶도록 디자인 구현<br/><br/><br/>

📌 Account<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/fdde5d9a-15d8-42d1-8b95-5ffbbf8e6cb2"><br/><br/>
- **회원가입:** ID를 입력하여 회원가입을 진행, 회원가입 시 5000포인트를 적립되며 중복 ID 불가<br/>
- **추천인 등록:** 추천인을 등록할 수 있으며 추천을 한 사람에게는 500포인트, 받은 사람에게는 1000포인트를 적립, 추천은 계정 당 1회만 가능<br/>
- **회원탈퇴:** ID를 입력하여 회원탈퇴를 진행, 회원탈퇴 시 적립 포인트 모두 삭제<br/><br/><br/>

📌 Payment<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/b6e8f7ee-7434-4747-a936-cbadc07402ab"><br/><br/>
- **결제:** 본인의 ID를 입력하고 결제할 가격과 사용할 포인트 입력 (사용하지 않을 시에는 0 입력)<br/>
- **포인트 적립:** 사용자가 결제 진행 후 결제한 가격의 1% 포인트 적립<br/>
- **관리자 수수료:** 결제한 가격의 2% 수수료를 징수<br/><br/><br/>

📌 Send<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/fe2fd520-fee9-4f44-8473-cdeac31fc851"><br/><br/>
- **포인트 선물:** 보내는 유저와 받는 유저의 ID를 입력 후 선물 포인트 입력 후 버튼을 누르면 5% 수수료를 빼고 받는 유저에게 지급<br/>
- **관리자 수수료:** 선물 포인트의 5% 수수료를 징수<br/><br/><br/>

📌 Event<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/a1237384-a054-4589-a2ba-5a715ca32427"><br/><br/>
- **로또 참여:** 유저 ID를 입력하여 참여, 입력한 유저는 100포인트를 차감하고 Lotto 총 금액에 추가, 로또 당첨 시 Lotto 총 금액에 대한 포인트를 받음<br/>
- **회원정보 및 Lotto 금액:** 유저들이 서비스를 이용하면서 자신의 포인트와 로또 금액을 볼 수 있도록 구현<br/><br/><br/>

📌 일별 지출 확인<br/>
<img width=100% src="https://github.com/hkyuuu00/dev-mode/assets/155419559/074ea8f0-270b-4e14-a45d-021895b1e2b0"><br/><br/>
- **비밀번호 입력:** 관리자 페이지이기에 다른 유저가 들어오지 못하도록 패스워드 입력 후 접근 가능<br/>
- **수수료 조회:** 관리자가 징수한 수수료를 확인할 수 있도록 구현<br/>
- **로또 이벤트 참여자 조회:** 로또의 참여자 명단을 기록하도록 구현<br/>
- **로또 추첨 버튼:** 로또를 추첨하여 당첨된 유저에게 Lotto 총 금액에 모인 포인트 지급, 로또는 랜덤으로 당첨<br/><br/><br/>


### 🛠 문제 해결 과정
<table>
  <tr>
    <td>
    <strong>문제</strong>
    </td>
    <td>**</td>
  </tr>
  <tr>
    <td>원인</td>
    <td></td>
  </tr>
  <tr>
    <td>해결</td>
    <td></td>
  </tr>
</table>

---

## ⚙️ 프로젝트 설치 및 실행 방법

### 📝 Prerequisites
- Node.js 14.x 이상
- Docker 20.x 이상
cURL
도커Docker Community Edition CE 23.0.6
도커 Compose 1.27.4 이상
Go 언어 1.16.7
Git 2.9.x 이상
Python 2.7.17
Node.js 12.13.1(https://nodejs.org/)
npm 5.6.0
VSCode v1.28

버추얼박스 VirtualBox 6.1

우분투 Ubuntu 22.04.x

cd ~/go/src
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9


### 📦 설치 방법
프로젝트를 로컬에 설치하는 방법을 단계별로 설명합니다.

```sh
git clone https://github.com/your-username/your-project.git
cd your-project
npm install
