const shim = require('fabric-shim');
const util = require('util');

const ABstore = class {

  async Init(stub) {
    console.info('========= ABstore Init =========');
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    try {
      await stub.putState("admin", Buffer.from("0"));
      await stub.putState("lotto", Buffer.from("0"));
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }
//-----------------------------------------------------------------------------------회원가입(추천인 서비스 추가해야함)
  async init(stub, args) {
    if (args.length != 1) {
      return shim.error('Incorrect number of arguments. Expecting 2');
    }

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

    let Mevalbytes = await stub.getState(Me);
    if (!Mevalbytes) {
      throw new Error('Failed to get state of asset holder Me');
    }
    let Meval = parseInt(Mevalbytes.toString());
  
    let MeRecommendKey = 'recommended_by_' + Me;
    let MeRecommendBytes = await stub.getState(MeRecommendKey);
    if (MeRecommendBytes && MeRecommendBytes.length > 0) {
      throw new Error('This user has already recommended someone.');
    }
  
    let Recommendervalbytes = await stub.getState(Recommender);
    if (!Recommendervalbytes) {
      throw new Error('Failed to get state of asset holder Recommender');
    }
    let Recommenderval = parseInt(Recommendervalbytes.toString());
  
    Meval += 500;
    Recommenderval += 1000;
  
    await stub.putState(Me, Buffer.from(Meval.toString()));
    await stub.putState(Recommender, Buffer.from(Recommenderval.toString()));
    await stub.putState(MeRecommendKey, Buffer.from(Recommender));
  }

//-----------------------------------------------------------------------------------포인트 거래
  async gift(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let A = args[0];
    let B = args[1];
    let Admin = "admin";
    if (!A || !B) {
      throw new Error('asset holding must not be empty');
    }

    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());

    let Bvalbytes = await stub.getState(B);
    if (!Bvalbytes) {
      throw new Error('Failed to get state of asset holder B');
    }
    let Bval = parseInt(Bvalbytes.toString());

    let AdminValbytes = await stub.getState(Admin);
    if (!AdminValbytes) {
      throw new Error('Failed to get state of asset Admin');
    }
    let AdminVal = parseInt(AdminValbytes.toString());

    let amount = parseInt(args[2]);
    if (isNaN(amount)) {
      throw new Error('Expecting integer value for amount to be transferred');
    }

    Aval -= amount;
    Bval += amount - ( amount * 0.05 );
    AdminVal += ( amount * 0.05 );
    console.info(util.format('Aval = %d, Bval = %d, AdminVal = %d\n', Aval, Bval, AdminVal));

    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(B, Buffer.from(Bval.toString()));
    await stub.putState(Admin, Buffer.from(AdminVal.toString()));
  }
//-----------------------------------------------------------------------------------유저 삭제
  async delete(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }
    let A = args[0];
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