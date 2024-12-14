
use aiken/collection/dict
use aiken/collection/list
use cardano/assets.{PolicyId}
use cardano/transaction.{OutputReference, Transaction}
use course/types.{Hackathon, MBuy, MDelist, MEdit, MarketAction, MarketDatum, NFTData}
use cardano/address.{VerificationKey}

validator hackathon {
  create_challenge(
    challengeId: String,
    rewardAmount: Int,
    tx: Transaction
  ) {
    // Tạo thử thách hackathon mới, thưởng NFT cho người tham gia
    let challengeDatum = Hackathon { id: challengeId, reward: rewardAmount }
    
    // Tạo đầu ra cho thử thách hackathon
    let output = t.output(
      t.scriptAddress(#"hackathon_script_address"),
      assets.from_lovelace(0),
      InlineDatum(challengeDatum)
    )

    let tx = Transaction {
      inputs: [],
      outputs: [output],
      extra_signatories: [],
    }

    // Trả về kết quả là tạo thành công
    True
  }

  participate(challengeId: String, user: VerificationKey, tx: Transaction) {
    // Kiểm tra thử thách có hợp lệ không
    let challengeDatum = t.findDatumByChallengeId(challengeId)
    
    // Nếu thử thách hợp lệ và chưa được hoàn thành, thưởng NFT cho người tham gia
    when challengeDatum is {
      Some(datum) -> {
        // Tạo NFT cho người tham gia thử thách
        let nftDatum = NFTData { owner: user, challengeId: challengeId }
        let nftMintOutput = t.output(
          t.walletAddress(user),
          assets.from_lovelace(0),
          InlineDatum(nftDatum)
        )
        let tx = Transaction {
          inputs: [],
          outputs: [nftMintOutput],
          extra_signatories: [user],
        }

        // Đã tham gia và nhận NFT
        True
      }
      None -> fail
    }
  }
}

test hackathonCreate() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  hackathon.create_challenge("daily_challenge", 1, tx)
}

test hackathonParticipate() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  hackathon.participate("daily_challenge", #"user_1", tx)
}



// validator mint_nft {
//   param(name: String, owner: Address) -> NFT {
//     level: 1,
//     day: "0",
//     point: 0,
//     owner: owner,
//     last_update: "0"
//   }
// }

// validator complete_mission {
//   param(nft: NFT, current_day: String, owner: Address) -> NFT {
//     if nft.owner != owner {
//       error("Không tồn tại owner")
//     }
//     if nft.day == current_day {
//       error("Mission hôm nay đã hoàn thành")
//     }

//     let updated_day = current_day
//     let updated_level = nft.level
//     if String.to_int(current_day) % (10 * nft.level) == 0 {
//       updated_level = nft.level + 1
//     }

//     NFT {
//       name: nft.name,
//       level: updated_level,
//       day: updated_day,
//       point: nft.point + updated_level * 10,
//       owner: nft.owner,
//       last_update: updated_day
//     }
//   }
// }

// validator redeem_point {
//   param(nft: NFT, redeem_point: Int, owner: Address) -> NFT {
//     if nft.owner != owner {
//       error("Không tồn tại owner")
//     }
//     if nft.point < redeem_point {
//       error("Không đủ point")
//     }

//     NFT {
//       name: nft.name,
//       level: nft.level,
//       day: nft.day,
//       point: nft.point - redeem_point,
//       owner: nft.owner,
//       last_update: nft.last_update
//     }
//   }
// }

// validator vesting {
//   param(nft: NFT, vesting_amount: Int, owner: Address) -> NFT {
//     if nft.owner != owner {
//       error("không tồn tại owner")
//     }
//     NFT {
//       name: nft.name,
//       level: nft.level,
//       day: nft.day,
//       point: nft.point + vesting_amount,
//       owner: nft.owner,
//       last_update: nft.last_update
//     }
//   }
// }

// test mint_nft_test {
//   let nft = mint_nft("Example NFT", "addr1")
//   assert nft.name == "Example NFT"
//   assert nft.level == 1
//   assert nft.day == "0"
//   assert nft.point == 0
//   assert nft.owner == "addr1"
//   assert nft.last_update == "0"
// }

// test complete_mission_test {
//   let nft = mint_nft("Example NFT", "addr1")
//   let updated_nft = complete_mission(nft, "20240101", "addr1")
//   assert updated_nft.level == 1
//   assert updated_nft.day == "20240101"
//   assert updated_nft.point == 10
// }

// test redeem_point_test {
//   let nft = mint_nft("Example NFT", "addr1")
//   let updated_nft = complete_mission(nft, "20240101", "addr1")
//   let final_nft = redeem_point(updated_nft, 10, "addr1")
//   assert final_nft.point == 0
// }

// test vesting_test {
//   let nft = mint_nft("Example NFT", "addr1")
//   let vested_nft = vesting(nft, 50, "addr1")
//   assert vested_nft.point == 50
// }

