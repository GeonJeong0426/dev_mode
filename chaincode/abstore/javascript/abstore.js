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
    await stub.putState(A, Buffer.from("5000"));
  }
  //-----------------------------------------------------------------------------------recommender
  async recommender(stub, args) {
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }
  
    let Me = args[0];
    let Recommender = args[1];
  
    if (!Recommender || !Me) {
      throw new Error('Asset holding must not be empty');
    }
  
    // Fetch the state for 'Me'
    let Mevalbytes = await stub.getState(Me);
    if (!Mevalbytes) {
      throw new Error('Failed to get state of asset holder Me');
    }
    let Meval = parseInt(Mevalbytes.toString());
  
    // Check if Me has already recommended someone
    let MeRecommendKey = 'recommended_by_' + Me;
    let MeRecommendBytes = await stub.getState(MeRecommendKey);
    if (MeRecommendBytes && MeRecommendBytes.length > 0) {
      throw new Error('This user has already recommended someone.');
    }
  
    // Fetch the state for 'Recommender'
    let Recommendervalbytes = await stub.getState(Recommender);
    if (!Recommendervalbytes) {
      throw new Error('Failed to get state of asset holder Recommender');
    }
    let Recommenderval = parseInt(Recommendervalbytes.toString());
  
    // Update the balances
    Meval += 500;
    Recommenderval += 1000;
  
    // Store the updated balances
    await stub.putState(Me, Buffer.from(Meval.toString()));
    await stub.putState(Recommender, Buffer.from(Recommenderval.toString()));
  
    // Store the information that Me has recommended someone
    await stub.putState(MeRecommendKey, Buffer.from(Recommender));
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
    Aval -= amount;
    // 자산 소유자 B의 자산 증가 (수수료 제외)
    Bval += amount - ( amount * 0.05 );
    // 관리자 자산 증가 (수수료)
    AdminVal += ( amount * 0.05 );
    // 자산 상태 로그 출력
    console.info(util.format('Aval = %d, Bval = %d, AdminVal = %d\n', Aval, Bval, AdminVal));

    // 자산 소유자 A의 상태 업데이트
    await stub.putState(A, Buffer.from(Aval.toString()));
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
  // async query(stub, args) {
  //   if (args.length != 1) {
  //     throw new Error('Incorrect number of arguments. Expecting name of the person to query');
  //   }

  //   let jsonResp = {};
  //   let A = args[0];

  //   try {
  //     let Avalbytes = await stub.getState(A);
  //     if (!Avalbytes || Avalbytes.length === 0) {
  //       jsonResp.error = 'Failed to get state for ' + A;
  //       throw new Error(JSON.stringify(jsonResp));
  //     }

  //     jsonResp.name = A;
  //     jsonResp.amount = Avalbytes.toString('utf8');
  //     console.info('Query Response:');
  //     console.info(jsonResp);

  //     return Buffer.from(JSON.stringify(jsonResp));
  //   } catch (err) {
  //     console.error('Error in query:', err);
  //     throw new Error('Error in query function: ' + err.message);
  //   }
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
  
    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(Admin, Buffer.from(AdminVal.toString()));
  }
  //-----------------------------------------------------------------------------------로또(추첨추가해야함)
  async lotto(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let A = args[0];
    let Lotto = "lotto";
    if (!A) {
      throw new Error('Invalid arguments');
    }

    let Avalbytes = await stub.getState(A);
    if (!Avalbytes || Avalbytes.length === 0) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());

    let LottoValbytes = await stub.getState(Lotto);
    if (!LottoValbytes || LottoValbytes.length === 0) {
      throw new Error('Failed to get state of asset Lotto');
    }
    let LottoVal = parseInt(LottoValbytes.toString());

    let ParticipantsBytes = await stub.getState("participants");
    let participants = [];
    if (ParticipantsBytes && ParticipantsBytes.length > 0) {
      participants = JSON.parse(ParticipantsBytes.toString());
    }

    if (Aval < 100) {
      throw new Error('Insufficient points to participate in the lotto');
    }

    Aval -= 100;
    LottoVal += 100;
    participants.push(A);

    console.info(util.format('Aval = %d, LottoVal = %d\n', Aval, LottoVal));
    console.info('Participants:', participants);

    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(Lotto, Buffer.from(LottoVal.toString()));
    await stub.putState("participants", Buffer.from(JSON.stringify(participants)));
  }

  async drawLotto(stub, args) {
    let Lotto = "lotto";
    let Participants = "participants";

    let LottoValbytes = await stub.getState(Lotto);
    if (!LottoValbytes || LottoValbytes.length === 0) {
      throw new Error('Failed to get state of asset Lotto');
    }
    let LottoVal = parseInt(LottoValbytes.toString());

    let ParticipantsBytes = await stub.getState(Participants);
    if (!ParticipantsBytes || ParticipantsBytes.length === 0) {
      throw new Error('No participants in the lotto');
    }
    let participants = JSON.parse(ParticipantsBytes.toString());
    if (participants.length === 0) {
      throw new Error('No participants in the lotto');
    }

    let winnerIndex = Math.floor(Math.random() * participants.length);
    let winner = participants[winnerIndex];

    let WinnerValbytes = await stub.getState(winner);
    if (!WinnerValbytes || WinnerValbytes.length === 0) {
      throw new Error('Failed to get state of asset holder winner');
    }
    let WinnerVal = parseInt(WinnerValbytes.toString());

    WinnerVal += LottoVal;
    LottoVal = 0;
    participants = [];

    console.info(util.format('Winner = %s, WinnerVal = %d\n', winner, WinnerVal));
    console.info('Participants:', participants);

    await stub.putState(winner, Buffer.from(WinnerVal.toString()));
    await stub.putState(Lotto, Buffer.from(LottoVal.toString()));
    await stub.putState(Participants, Buffer.from(JSON.stringify([])));
  }

  //-----------------------------------------------------------------------------query all
  async query(stub, args) {
    if (args.length != 0) {
      throw new Error('Incorrect number of arguments. Expecting no arguments');
    }

    let startKey = '';
    let endKey = '';
    let iterator = await stub.getStateByRange(startKey, endKey);
    let allResults = [];
    while (true) {
      let res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString());
        } catch (err) {
          jsonRes.Record = res.value.value.toString();
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }
    console.info('Query Response:');
    console.info(allResults);
    return Buffer.from(JSON.stringify(allResults));
  }
};

shim.start(new ABstore());