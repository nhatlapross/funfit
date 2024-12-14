
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction, OutputReference, InlineDatum}
use aiken/collection/list
use aiken/primitive/string
use course/types.{NFTData}

pub type Level = Int
pub type Timestamp = Int  // Để lưu trữ thời gian vesting

// NFT Data Structure
pub type NFTData = {
  name: String,
  day: String,             // ngày dưới dạng chuỗi "yyyymmdd"
  level: Level,            // cấp độ của NFT
  last_update: String,     // ngày cập nhật cuối cùng
  point: Int,              // điểm của NFT
  vesting_start: Timestamp, // Thời gian bắt đầu vesting
  vesting_end: Timestamp   // Thời gian kết thúc vesting
}  

validator nft {

  // Chỉnh sửa thông tin NFT
  edit_nft(r: Redeemer, nftId: String, newDay: String, newPoint: Int, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum != None {
      let currentNFT = nftDatum
      let currentDay = currentNFT.day
      let lastUpdate = currentNFT.last_update
      let currentPoint = currentNFT.point
      let level = currentNFT.level
      let vestingEnd = currentNFT.vesting_end

      // Kiểm tra ngày truyền vào có trùng với last_update không
      when newDay == lastUpdate {
        fail
      }

      // Kiểm tra nếu NFT chưa hết thời gian vesting
      when currentNFT.vesting_end > t.timestamp() {
        fail
      }

      // Tính toán điểm mới cho NFT
      let newPoint = when level is {
        1 -> currentPoint + (newPoint + 10),  // lv1 cộng thêm 10 điểm
        2 -> currentPoint + (newPoint + 20),  // lv2 cộng thêm 20 điểm
        _ -> currentPoint + newPoint          // các cấp độ khác cộng điểm trực tiếp
      }

      // Cập nhật ngày và điểm mới, đồng thời gán last_update = newDay
      let updatedNFT = NFTData {
        name: currentNFT.name,
        day: newDay,
        level: currentNFT.level,
        last_update: newDay,
        point: newPoint,
        vesting_start: currentNFT.vesting_start,
        vesting_end: currentNFT.vesting_end
      }

      // Tạo đầu ra mới để cập nhật thông tin NFT
      let output = t.output(
        t.walletAddress(#"owner_address"),
        assets.from_lovelace(0),
        InlineDatum(updatedNFT)
      )

      let tx = Transaction {
        inputs: [],
        outputs: [output],
        extra_signatories: [],
      }   
      True
    
    }
    else {
      fail
    }
  }

  // Thêm điểm cho NFT
  add_point(r: Redeemer, nftId: String, pointToAdd: Int, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum != None {
      let currentNFT = nftDatum
      let currentPoint = currentNFT.point

      // Kiểm tra nếu NFT chưa hết thời gian vesting
      when currentNFT.vesting_end > t.timestamp() {
        fail
      }

      // Cộng thêm điểm vào NFT
      let newPoint = currentPoint + pointToAdd

      // Cập nhật lại NFT với điểm mới
      let updatedNFT = NFTData {
        name: currentNFT.name,
        day: currentNFT.day,
        level: currentNFT.level,
        last_update: currentNFT.last_update,
        point: newPoint,
        vesting_start: currentNFT.vesting_start,
        vesting_end: currentNFT.vesting_end
      }

      // Tạo đầu ra mới để cập nhật thông tin NFT
      let output = t.output(
        t.walletAddress(#"owner_address"),
        assets.from_lovelace(0),
        InlineDatum(updatedNFT)
      )

      let tx = Transaction {
        inputs: [],
        outputs: [output],
        extra_signatories: [],
      }
      True

    }
    else {
      fail
    }
  }

  // Rút điểm từ NFT
  withdraw_point(r: Redeemer, nftId: String, pointToWithdraw: Int, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum != None {
      let currentNFT = nftDatum
      let currentPoint = currentNFT.point

      // Kiểm tra nếu NFT chưa hết thời gian vesting
      when currentNFT.vesting_end > t.timestamp() {
        fail
      }

      // Kiểm tra nếu điểm yêu cầu rút không vượt quá số điểm hiện tại
      when pointToWithdraw <= currentPoint {
        let newPoint = currentPoint - pointToWithdraw

        // Cập nhật lại NFT với điểm sau khi rút
        let updatedNFT = NFTData {
          name: currentNFT.name,
          day: currentNFT.day,
          level: currentNFT.level,
          last_update: currentNFT.last_update,
          point: newPoint,
          vesting_start: currentNFT.vesting_start,
          vesting_end: currentNFT.vesting_end
        }

        // Tạo đầu ra mới để cập nhật thông tin NFT
        let output = t.output(
          t.walletAddress(#"owner_address"),
          assets.from_lovelace(0),
          InlineDatum(updatedNFT)
        )

        let tx = Transaction {
          inputs: [],
          outputs: [output],
          extra_signatories: [],
        }
        True

      }
      else {
        fail  // Điểm yêu cầu rút vượt quá số điểm hiện có
      }
    }
    else {
      fail  // NFT không tồn tại
    }
  }

  // Tham gia hackathon
  join_hackathon(r: Redeemer, nftId: String, hackathonDay: String, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum != None {
      let currentNFT = nftDatum

      // Kiểm tra nếu NFT chưa hết thời gian vesting
      when currentNFT.vesting_end > t.timestamp() {
        fail
      }

      // Kiểm tra ngày tham gia hackathon
      when currentNFT.day == hackathonDay {
        fail
      }

      // Cập nhật thông tin NFT và cộng điểm
      let updatedNFT = NFTData {
        name: currentNFT.name,
        day: hackathonDay,
        level: currentNFT.level,
        last_update: hackathonDay,
        point: currentNFT.point + 10,  // Cộng điểm hackathon
        vesting_start: currentNFT.vesting_start,
        vesting_end: currentNFT.vesting_end
      }

      // Tạo đầu ra mới để cập nhật thông tin NFT
      let output = t.output(
        t.walletAddress(#"owner_address"),
        assets.from_lovelace(0),
        InlineDatum(updatedNFT)
      )

      let tx = Transaction {
        inputs: [],
        outputs: [output],
        extra_signatories: [],
      }

      True
    }
    else {
      fail
    }
  }
}


test editNFT() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  nft.edit_nft(OneMint, "nft_1", "20240101", 20, tx)
}

test addPoint() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  nft.add_point(OneMint, "nft_1", 30, tx)
}

test withdrawPoint() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  nft.withdraw_point(OneMint, "nft_1", 10, tx)
}


// use aiken/collection/list
// use aiken/crypto.{VerificationKeyHash}
// use cardano/transaction.{OutputReference, Transaction}
// use aiken/int

// pub type NFT {
//   name: String,
//   level: Int,
//   day: String,
//   point: Int,
//   owner: VerificationKeyHash,
//   last_update: String
// }

// validator mint_nft {
//   param(name: String, owner: VerificationKeyHash) -> NFT {
//     NFT {
//       name: name,
//       level: 1,
//       day: "0",
//       point: 0,
//       owner: owner,
//       last_update: "0"
//     }
//   }
// }

// validator complete_mission {
//   param(nft: NFT, current_day: String, owner: VerificationKeyHash) -> NFT {
//     if nft.owner != owner {
//       error("Invalid owner")
//     } else if nft.day == current_day {
//       error("Mission already completed today")
//     } else {
//       let updated_day = current_day
//       let updated_level = if String.to_int(current_day) % (10 * nft.level) == 0 {
//         nft.level + 1
//       } else {
//         nft.level
//       }

//       NFT {
//         name: nft.name,
//         level: updated_level,
//         day: updated_day,
//         point: nft.point + updated_level * 10,
//         owner: nft.owner,
//         last_update: updated_day
//       }
//     }
//   }
// }

// validator redeem_point {
//   param(nft: NFT, redeem_point: Int, owner: VerificationKeyHash) -> NFT {
//     if nft.owner != owner {
//       error("Invalid owner")
//     } else if nft.point < redeem_point {
//       error("Insufficient points")
//     } else {
//       NFT {
//         name: nft.name,
//         level: nft.level,
//         day: nft.day,
//         point: nft.point - redeem_point,
//         owner: nft.owner,
//         last_update: nft.last_update
//       }
//     }
//   }
// }

// validator vesting {
//   param(nft: NFT, vesting_amount: Int, owner: VerificationKeyHash) -> NFT {
//     if nft.owner != owner {
//       error("Invalid owner")
//     } else {
//       NFT {
//         name: nft.name,
//         level: nft.level,
//         day: nft.day,
//         point: nft.point + vesting_amount,
//         owner: nft.owner,
//         last_update: nft.last_update
//       }
//     }
//   }
// }

// test mint_nft_test() {
//   let nft = mint_nft("Example NFT", VerificationKeyHash.new([0x01]))
//   assert nft.name == "Example NFT"
//   assert nft.level == 1
//   assert nft.day == "0"
//   assert nft.point == 0
//   assert nft.owner == VerificationKeyHash.new([0x01])
//   assert nft.last_update == "0"
// }

// test complete_mission_test() {
//   let nft = mint_nft("Example NFT", VerificationKeyHash.new([0x01]))
//   let updated_nft = complete_mission(nft, "20240101", VerificationKeyHash.new([0x01]))
//   assert updated_nft.level == 1
//   assert updated_nft.day == "20240101"
//   assert updated_nft.point == 10
// }

// test redeem_point_test() {
//   let nft = mint_nft("Example NFT", VerificationKeyHash.new([0x01]))
//   let updated_nft = complete_mission(nft, "20240101", VerificationKeyHash.new([0x01]))
//   let final_nft = redeem_point(updated_nft, 10, VerificationKeyHash.new([0x01]))
//   assert final_nft.point == 0
// }

// test vesting_test() {
//   let nft = mint_nft("Example NFT", VerificationKeyHash.new([0x01]))
//   let vested_nft = vesting(nft, 50, VerificationKeyHash.new([0x01]))
//   assert vested_nft.point == 50
// }