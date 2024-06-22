// fabric-shim 모듈을 불러옴 (Hyperledger Fabric 체인코드 라이브러리)
const shim = require('fabric-shim');

// util 모듈을 불러옴 (유틸리티 기능 제공)
const util = require('util');

// ABstore 클래스 선언
const ABstore = class {

  // Init 함수는 체인코드 초기화를 담당
  async Init(stub) {
    // 초기화 시작 로그 출력
    console.info('========= ABstore Init =========');
    // 함수와 파라미터를 가져옴
    let ret = stub.getFunctionAndParameters();
    // 함수와 파라미터 출력
    console.info(ret);
    try {
      // "admin" 키를 "0" 값으로 상태에 저장
      await stub.putState("admin", Buffer.from("0"));
      await stub.putState("lotto", Buffer.from("0"));
      // 성공 반환
      return shim.success();
    } catch (err) {
      // 오류 발생 시 오류 반환
      return shim.error(err);
    }
  }

  // Invoke 함수는 체인코드의 비즈니스 로직을 처리
  async Invoke(stub) {
    // 함수와 파라미터를 가져옴
    let ret = stub.getFunctionAndParameters();
    // 함수와 파라미터 출력
    console.info(ret);
    // 호출할 함수 이름으로 메서드 선택
    let method = this[ret.fcn];
    // 메서드가 없을 경우 로그 출력 후 성공 반환
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      // 선택된 메서드 호출 및 페이로드 반환
      let payload = await method(stub, ret.params);
      // 성공 반환
      return shim.success(payload);
    } catch (err) {
      // 오류 발생 시 로그 출력 후 오류 반환
      console.log(err);
      return shim.error(err);
    }
  }
//-----------------------------------------------------------------------------------회원가입(추천인 서비스 추가해야함)
  // init 함수는 자산 초기화를 담당
  async init(stub, args) {
    if (args.length != 1) {
      return shim.error('Incorrect number of arguments. Expecting 2');
    }

    // 첫 번째 인자를 자산 소유자 A로 설정
    let A = args[0];
    await stub.putState(userID, Buffer.from("5000"));
  }
//-----------------------------------------------------------------------------------포인트 거래
  // invoke 함수는 자산 이전을 담당
  async gift(stub, args) {
    // 인자 개수가 3개가 아니면 오류 발생
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    // 첫 번째 인자를 자산 소유자 A로 설정
    let A = args[0];
    // 두 번째 인자를 자산 소유자 B로 설정
    let B = args[1];
    // 관리자 키 설정
    let Admin = "admin";
    // 자산 소유자 A 또는 B가 비어있으면 오류 발생
    if (!A || !B) {
      throw new Error('asset holding must not be empty');
    }

    // 자산 소유자 A의 상태를 가져옴
    let Avalbytes = await stub.getState(A);
    // 자산 소유자 A의 상태가 없으면 오류 발생
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    // 자산 소유자 A의 값을 정수로 변환
    let Aval = parseInt(Avalbytes.toString());

    // 자산 소유자 B의 상태를 가져옴
    let Bvalbytes = await stub.getState(B);
    // 자산 소유자 B의 상태가 없으면 오류 발생
    if (!Bvalbytes) {
      throw new Error('Failed to get state of asset holder B');
    }
    // 자산 소유자 B의 값을 정수로 변환
    let Bval = parseInt(Bvalbytes.toString());

    // 관리자 상태를 가져옴
    let AdminValbytes = await stub.getState(Admin);
    // 관리자 상태가 없으면 오류 발생
    if (!AdminValbytes) {
      throw new Error('Failed to get state of asset Admin');
    }

    // 관리자 값을 정수로 변환 (오류 수정 필요)
    let AdminVal = parseInt(AdminValbytes.toString());

    // 이전할 금액을 정수로 변환
    let amount = parseInt(args[2]);
    // 금액이 숫자가 아니면 오류 발생
    if (isNaN(amount)) {
      throw new Error('Expecting integer value for amount to be transferred');
    }

    // 자산 소유자 A의 자산 감소
    Aval = Aval - amount;
    // 자산 소유자 B의 자산 증가 (수수료 제외)
    Bval = Bval + amount - ( amount / 5 );
    // 관리자 자산 증가 (수수료)
    AdminVal = AdminVal + ( amount / 5 );
    // 자산 상태 로그 출력
    console.info(util.format('Aval = %d, Bval = %d, AdminVal = %d\n', Aval, Bval, AdminVal));

    // 자산 소유자 A의 상태 업데이트
    await stub.putState(A, Buffer.from(A.toString()));
    // 자산 소유자 B의 상태 업데이트
    await stub.putState(B, Buffer.from(Bval.toString()));
    // 관리자 상태 업데이트
    await stub.putState(Admin, Buffer.from(AdminVal.toString()));
  }
//-----------------------------------------------------------------------------------유저 삭제
  // delete 함수는 자산 상태 삭제를 담당
  async delete(stub, args) {
    // 인자 개수가 1개가 아니면 오류 발생
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    // 첫 번째 인자를 자산 소유자 A로 설정
    let A = args[0];

    // 자산 소유자 A의 상태 삭제
    await stub.deleteState(A);
  }
//-----------------------------------------------------------------------------------조회(전체조회로 수정해야함)
async query(stub, args) {
  if (args.length != 1) {
    throw new Error('Incorrect number of arguments. Expecting name of the person to query');
  }

  let jsonResp = {};
  let A = args[0];

  let Avalbytes = await stub.getState(A);
  if (!Avalbytes) {
    jsonResp.error = 'Failed to get state for ' + A;
    throw new Error(JSON.stringify(jsonResp));
  }

  jsonResp.name = A;
  jsonResp.amount = Avalbytes.toString();
  console.info('Query Response:');
  console.info(jsonResp);
  return Avalbytes;
}
  // async queryAll(stub) {
  //   // JSON 응답 객체 생성
  //   let jsonResp = {};
  
  //   // 모든 상태를 가져오기 위해 빈 문자열로 시작하고 끝을 설정
  //   let startKey = '';
  //   let endKey = '';
  
  //   // 범위 내 모든 상태를 가져옴
  //   let iterator = await stub.getStateByRange(startKey, endKey);
    
  //   // 결과를 저장할 배열
  //   let allResults = [];
  //   while (true) {
  //     let res = await iterator.next();
      
  //     if (res.value && res.value.value.toString()) {
  //       // 상태 객체를 생성
  //       let jsonRes = {};
  //       jsonRes.key = res.value.key;
  //       try {
  //         // 값이 JSON 형태이면 파싱
  //         jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
  //       } catch (err) {
  //         // JSON 형태가 아니면 문자열로 저장
  //         jsonRes.value = res.value.value.toString('utf8');
  //       }
  //       // 결과 배열에 추가
  //       allResults.push(jsonRes);
  //     }
  //     if (res.done) {
  //       // 반복기 종료
  //       await iterator.close();
  //       break;
  //     }
  //   }
  
  //   // 전체 결과를 JSON 응답 객체에 설정
  //   jsonResp.results = allResults;
    
  //   // 조회 응답 로그 출력
  //   console.info('QueryAll Response:');
  //   console.info(jsonResp);
    
  //   // JSON 응답 객체 반환
  //   return Buffer.from(JSON.stringify(jsonResp));
  // }
  //-----------------------------------------------------------------------------------결제
  async payment(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }
  
    let A = args[0];
    let amount = parseInt(args[1]);
    let pointsToUse = parseInt(args[2]);
    let Admin = "admin";

    if (!A || isNaN(amount) || isNaN(pointsToUse)) {
      throw new Error('Invalid arguments');
    }
  
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());
  
    let AdminValbytes = await stub.getState(Admin);
    if (!AdminValbytes) {
      throw new Error('Failed to get state of asset Admin');
    }
    let AdminVal = parseInt(AdminValbytes.toString());
  
    if (pointsToUse > Aval) {
      throw new Error('Insufficient points');
    }
  
    if (isNaN(amount)) {
      throw new Error('Expecting integer value for amount to be transferred');
    }
  
    Aval += (amount * 0.01) - pointsToUse;
    AdminVal += (amount * 0.02);
  
    console.info(util.format('Aval = %d, AdminVal = %d\n', Aval, AdminVal));
  
    await stub.putState(A, Buffer.from(A.toString()));
    await stub.putState(Admin, Buffer.from(AdminVal.toString()));
  }
//-----------------------------------------------------------------------------------로또(추첨추가해야함)
  async lotto(stub, args) {
    // 인자 개수가 3개가 아니면 오류 발생
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }
  
    // 첫 번째 인자를 자산 소유자 A로 설정
    let A = args[0];
    // 관리자 키 설정
    let Lotto = "lotto";
    // 자산 소유자 A 또는 B가 비어있으면 오류 발생
    if (!A) {
      throw new Error('Invalid arguments');
    }
  
    // 자산 소유자 A의 상태를 가져옴
    let Avalbytes = await stub.getState(A);
    // 자산 소유자 A의 상태가 없으면 오류 발생
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    // 자산 소유자 A의 값을 정수로 변환
    let Aval = parseInt(Avalbytes.toString());
  
    // 관리자 상태를 가져옴
    let LottoValbytes = await stub.getState(Lotto);
    // 관리자 상태가 없으면 오류 발생
    if (!LottoValbytes) {
      throw new Error('Failed to get state of asset Admin');
    }
    // 관리자 값을 정수로 변환 (오류 수정 필요)
    let LottoVal = parseInt(LottoValbytes.toString());
  
    // 금액이 숫자가 아니면 오류 발생
    if (isNaN(amount)) {
      throw new Error('Expecting integer value for amount to be transferred');
    }
  
    Aval -= 100
    Lotto += 100
  
    // 자산 상태 로그 출력
    console.info(util.format('Aval = %d, LottoVal = %d\n', Aval, LottoVal));
  
    // 자산 소유자 A의 상태 업데이트
    await stub.putState(A, Buffer.from(A.toString()));
    // 관리자 상태 업데이트
    await stub.putState(Lotto, Buffer.from(LottoVal.toString()));
  }
};

shim.start(new ABstore());