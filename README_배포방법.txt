안일중 AI 공부도우미 - Netlify 배포 및 오류 해결

중요: 이 프로젝트에는 Netlify 서버 함수가 있습니다. Netlify Drop에 ZIP을 올리는 정적 배포로는 AI 함수가 올라가지 않습니다. GitHub 저장소 연결 배포 또는 Netlify CLI로 배포해야 합니다.

배포 순서:
1. ZIP 압축을 풉니다.
2. 폴더 안의 모든 파일(public, netlify, netlify.toml, package.json)을 GitHub 저장소에 업로드합니다.
3. Netlify에서 Add new site > Import an existing project > GitHub를 선택하고 해당 저장소를 연결합니다.
4. Build settings:
   - Build command: 비워 두거나 npm install
   - Publish directory: public
   - Functions directory: netlify/functions
   netlify.toml에 같은 설정이 들어 있습니다.
5. Site configuration > Environment variables에 OPENAI_API_KEY를 추가합니다.
   OPENAI_MODEL도 선택적으로 추가할 수 있습니다. 값은 OpenAI API 계정에서 사용 가능한 모델 ID여야 합니다.
6. 저장 후 새 배포를 실행합니다.
7. 사이트에서 질문/요약 버튼을 테스트합니다.

404 / Unexpected token 'N', "Not Found" 오류:
AI 함수 URL에서 Netlify가 404 Not Found를 돌려준 것입니다. 대개 서버 함수가 배포되지 않은 정적 사이트로 배포했을 때 발생합니다. GitHub 연결 배포로 다시 배포하고 Deploy log에서 study 함수가 배포됐는지 확인하세요.

보안:
- API 키는 Netlify 환경변수에만 입력합니다.
- API 키를 HTML, GitHub 공개 저장소, 채팅에 올리지 마세요.
- API 이용료가 발생할 수 있으므로 보호자와 함께 사용량 한도를 설정하세요.
- 실제 학교 시험 범위는 교과서/선생님 안내를 확인하고 입력해야 합니다.
