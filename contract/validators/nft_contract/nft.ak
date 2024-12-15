use aiken/collection/list
use aiken/primitive/string
// use cardano/assets.{PolicyId}
// use cardano/transaction.{Transaction, OutputReference, InlineDatum}
// use aiken/collection/list
// use aiken/primitive/string
// use course/types.{NFTData}

// pub type Level = Int
// pub type Timestamp = Int  // Để lưu trữ thời gian vesting

// // NFT Data Structure
// pub type NFTData {
//   name: String,
//   day: Int,               // Số ngày tập luyện
//   level: Level,            // cấp độ của NFT
//   last_update: String,     // ngày cập nhật cuối cùng
//   point: Int,              // điểm của NFT
//   vesting_start: Timestamp, // Thời gian bắt đầu vesting
//   vesting_end: Timestamp   // Thời gian kết thúc vesting
// }  

// validator nft {
//   // Chỉnh sửa thông tin NFT
//   edit_nft(r: Redeemer, nftId: String, newDay: String, newPoint: Int, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     // Kiểm tra nếu NFT tồn tại
//     when nftDatum is {
//       Some(currentNFT) -> {
//         let currentDay = currentNFT.day
//         let lastUpdate = currentNFT.last_update
//         let currentPoint = currentNFT.point
//         let level = currentNFT.level
//         let vestingEnd = currentNFT.vesting_end

//         // Kiểm tra ngày truyền vào có trùng với last_update không
//         if newDay == lastUpdate {
//           fail
//         }
//         else{
//           // Kiểm tra nếu NFT chưa hết thời gian vesting
//           if currentNFT.vesting_end > t.timestamp() {
//             fail
//           }
//           else{
//             let current_day = current_day + 1
//             // Tính toán điểm mới cho NFT
//             let newPoint = currentPoint + level*10
//             if current_day % (level * 10) {
//               let level = level + 1
//               // Cập nhật ngày và điểm mới, đồng thời gán last_update = newDay
//               let updatedNFT = NFTData {
//                 name: currentNFT.name,
//                 day: current_day,
//                 level: level,
//                 last_update: newDay,
//                 point: newPoint,
//                 vesting_start: currentNFT.vesting_start,
//                 vesting_end: currentNFT.vesting_end
//               }

//               // Tạo đầu ra mới để cập nhật thông tin NFT
//               let output = t.output(
//                 t.walletAddress(#"owner_address"),
//                 assets.from_lovelace(0),
//                 InlineDatum(updatedNFT)
//               )

//               let tx = Transaction {
//                 inputs: [],
//                 outputs: [output],
//                 extra_signatories: [],
//               }   
//             }
//             else{
//               let level = currentNFT.level
//               // Cập nhật ngày và điểm mới, đồng thời gán last_update = newDay
//               let updatedNFT = NFTData {
//                 name: currentNFT.name,
//                 day: current_day,
//                 level: level,
//                 last_update: newDay,
//                 point: newPoint,
//                 vesting_start: currentNFT.vesting_start,
//                 vesting_end: currentNFT.vesting_end
//               }

//               // Tạo đầu ra mới để cập nhật thông tin NFT
//               let output = t.output(
//                 t.walletAddress(#"owner_address"),
//                 assets.from_lovelace(0),
//                 InlineDatum(updatedNFT)
//               )

//               let tx = Transaction {
//                 inputs: [],
//                 outputs: [output],
//                 extra_signatories: [],
//               }   
//             }
//             True
//           }
//         }
//       }
//       None -> fail
//     }
//   }

//   // Thêm điểm cho NFT
//    add_point(r: Redeemer, nftId: String, pointToAdd: Int, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     when nftDatum is {
//       Some(currentNFT) -> {
//         let currentPoint = currentNFT.point

//         // Kiểm tra nếu NFT chưa hết thời gian vesting
//         if currentNFT.vesting_end > t.timestamp() {
//           fail
//         }
//         else{
//           // Cộng thêm điểm vào NFT
//           let newPoint = currentPoint + pointToAdd

//           // Cập nhật lại NFT với điểm mới
//           let updatedNFT = NFTData {
//             name: currentNFT.name,
//             day: currentNFT.day,
//             level: currentNFT.level,
//             last_update: currentNFT.last_update,
//             point: newPoint,
//             vesting_start: currentNFT.vesting_start,
//             vesting_end: currentNFT.vesting_end
//           }

//           // Tạo đầu ra mới để cập nhật thông tin NFT
//           let output = t.output(
//             t.walletAddress(#"owner_address"),
//             assets.from_lovelace(0),
//             InlineDatum(updatedNFT)
//           )

//           let tx = Transaction {
//             inputs: [],
//             outputs: [output],
//             extra_signatories: [],
//           }
//           True
//         }
//       }
//       None -> fail
//     }
//   }

//   // Rút điểm từ NFT
//   withdraw_point(r: Redeemer, nftId: String, pointToWithdraw: Int, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     // Kiểm tra nếu NFT tồn tại
//     when nftDatum is {
//       Some(currentNFT) -> {
//         let currentPoint = currentNFT.point

//         // Kiểm tra nếu điểm yêu cầu rút không vượt quá số điểm hiện tại
//         if currentNFT.vesting_end > t.timestamp() {
//           fail
//         }
//         else{
//           if pointToWithdraw > currentPoint {
//             fail
//           }
//           else{
//             let newPoint = currentPoint - pointToWithdraw
//             // Cập nhật lại NFT với điểm sau khi rút
//             let updatedNFT = NFTData {
//               name: currentNFT.name,
//               day: currentNFT.day,
//               level: currentNFT.level,
//               last_update: currentNFT.last_update,
//               point: newPoint,
//               vesting_start: currentNFT.vesting_start,
//               vesting_end: currentNFT.vesting_end
//             }

//             // Tạo đầu ra mới để cập nhật thông tin NFT
//             let output = t.output(
//               t.walletAddress(#"owner_address"),
//               assets.from_lovelace(0),
//               InlineDatum(updatedNFT)
//             )

//             let tx = Transaction {
//               inputs: [],
//               outputs: [output],
//               extra_signatories: [],
//             }
//             True
//           }
//         }
//       }
//       None -> fail
//     }
//   }

//   // Tham gia hackathon
//   join_hackathon(r: Redeemer, nftId: String, hackathonDay: String, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     // Kiểm tra nếu NFT tồn tại
//     when nftDatum is {
//       Some(currentNFT) -> {
//           // Kiểm tra nếu NFT chưa hết thời gian vesting
//           if currentNFT.vesting_end > t.timestamp() {
//             fail
//           }
//           else{
//             // Kiểm tra ngày tham gia hackathon
//             if currentNFT.day == hackathonDay {
//               fail
//             }
//             else{
//                // Cập nhật thông tin NFT và cộng điểm
//               let updatedNFT = NFTData {
//                 name: currentNFT.name,
//                 day: hackathonDay,
//                 level: currentNFT.level,
//                 last_update: hackathonDay,
//                 point: currentNFT.point + 10,  // Cộng điểm hackathon
//                 vesting_start: currentNFT.vesting_start,
//                 vesting_end: currentNFT.vesting_end
//               }

//               // Tạo đầu ra mới để cập nhật thông tin NFT
//               let output = t.output(
//                 t.walletAddress(#"owner_address"),
//                 assets.from_lovelace(0),
//                 InlineDatum(updatedNFT)
//               )

//               let tx = Transaction {
//                 inputs: [],
//                 outputs: [output],
//                 extra_signatories: [],
//               }
//               True
//             }
//           }
//       }
//       None -> fail
//     }
//   }
// }

// test editNFT() {
//   let tx = Transaction {
//     inputs: [],
//     outputs: [],
//     extra_signatories: [],
//   }

//   nft.edit_nft(OneMint, "nft_1", "20240101", 20, tx)
// }

// test addPoint() {
//   let tx = Transaction {
//     inputs: [],
//     outputs: [],
//     extra_signatories: [],
//   }

//   nft.add_point(OneMint, "nft_1", 30, tx)
// }

// test withdrawPoint() {
//   let tx = Transaction {
//     inputs: [],
//     outputs: [],
//     extra_signatories: [],
//   }

//   nft.withdraw_point(OneMint, "nft_1", 10, tx)
// }

use cardano/assets.{PolicyId}
use cardano/transaction.{InlineDatum, OutputReference, Transaction}
use course/types.{NFTData}

pub type Level =
  Int

pub type Timestamp =
  Int

// Để lưu trữ thời gian vesting

// NFT Data Structure
pub type NFTData {
  name: String,
  day: Int,
  // Số ngày tập luyện
  level: Level,
  // cấp độ của NFT
  last_update: String,
  // ngày cập nhật cuối cùng
  point: Int,
  // điểm của NFT
  vesting_start: Timestamp,
  // Thời gian bắt đầu vesting
  vesting_end: Timestamp,
}

// Thời gian kết thúc vesting

pub const owner_address =
  #"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"

validator nft {
  // Chỉnh sửa thông tin NFT
  edit_nft(
    r: Redeemer,
    nftId: String,
    newDay: String,
    newPoint: Int,
    tx: Transaction,
  ) {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum is {
      Some(currentNFT) -> {
        let currentDay = currentNFT.day
        let lastUpdate = currentNFT.last_update
        let currentPoint = currentNFT.point
        let level = currentNFT.level
        let vestingEnd = currentNFT.vesting_end

        // Kiểm tra ngày truyền vào có trùng với last_update không
        if newDay == lastUpdate {
          fail
        } else {
          // Kiểm tra nếu NFT chưa hết thời gian vesting
          if currentNFT.vesting_end > t.timestamp() {
            fail
          } else {
            let current_day = current_day + 1
            // Tính toán điểm mới cho NFT
            let newPoint = currentPoint + level * 10
            if current_day % ( level * 10 ) {
              let level = level + 1
              // Cập nhật ngày và điểm mới, đồng thời gán last_update = newDay
              let updatedNFT =
                NFTData {
                  name: currentNFT.name,
                  day: current_day,
                  level,
                  last_update: newDay,
                  point: newPoint,
                  vesting_start: currentNFT.vesting_start,
                  vesting_end: currentNFT.vesting_end,
                }

              // Tạo đầu ra mới để cập nhật thông tin NFT
              let output =
                t.output(
                  t.walletAddress(owner_address),
                  assets.from_lovelace(0),
                  InlineDatum(updatedNFT),
                )

              let tx =
                Transaction {
                  inputs: [],
                  outputs: [output],
                  extra_signatories: [],
                }
            } else {
              let level = currentNFT.level
              // Cập nhật ngày và điểm mới, đồng thời gán last_update = newDay
              let updatedNFT =
                NFTData {
                  name: currentNFT.name,
                  day: current_day,
                  level,
                  last_update: newDay,
                  point: newPoint,
                  vesting_start: currentNFT.vesting_start,
                  vesting_end: currentNFT.vesting_end,
                }

              // Tạo đầu ra mới để cập nhật thông tin NFT
              let output =
                t.output(
                  t.walletAddress(owner_address),
                  assets.from_lovelace(0),
                  InlineDatum(updatedNFT),
                )

              let tx =
                Transaction {
                  inputs: [],
                  outputs: [output],
                  extra_signatories: [],
                }
            }
            True
          }
        }
      }
      None -> fail
    }
  }

  // Thêm điểm cho NFT
  add_point(r: Redeemer, nftId: String, pointToAdd: Int, tx: Transaction) {
    let nftDatum = t.findDatumById(nftId)

    when nftDatum is {
      Some(currentNFT) -> {
        let currentPoint = currentNFT.point

        // Kiểm tra nếu NFT chưa hết thời gian vesting
        if currentNFT.vesting_end > t.timestamp() {
          fail
        } else {
          // Cộng thêm điểm vào NFT
          let newPoint = currentPoint + pointToAdd

          // Cập nhật lại NFT với điểm mới
          let updatedNFT =
            NFTData {
              name: currentNFT.name,
              day: currentNFT.day,
              level: currentNFT.level,
              last_update: currentNFT.last_update,
              point: newPoint,
              vesting_start: currentNFT.vesting_start,
              vesting_end: currentNFT.vesting_end,
            }

          // Tạo đầu ra mới để cập nhật thông tin NFT
          let output =
            t.output(
              t.walletAddress(owner_address),
              assets.from_lovelace(0),
              InlineDatum(updatedNFT),
            )

          let tx =
            Transaction { inputs: [], outputs: [output], extra_signatories: [] }
          True
        }
      }
      None -> fail
    }
  }

  // Rút điểm từ NFT
  withdraw_point(
    r: Redeemer,
    nftId: String,
    pointToWithdraw: Int,
    tx: Transaction,
  ) {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum is {
      Some(currentNFT) -> {
        let currentPoint = currentNFT.point

        // Kiểm tra nếu điểm yêu cầu rút không vượt quá số điểm hiện tại
        if currentNFT.vesting_end > t.timestamp() {
          fail
        } else {
          if pointToWithdraw > currentPoint {
            fail
          } else {
            let newPoint = currentPoint - pointToWithdraw
            // Cập nhật lại NFT với điểm sau khi rút
            let updatedNFT =
              NFTData {
                name: currentNFT.name,
                day: currentNFT.day,
                level: currentNFT.level,
                last_update: currentNFT.last_update,
                point: newPoint,
                vesting_start: currentNFT.vesting_start,
                vesting_end: currentNFT.vesting_end,
              }

            // Tạo đầu ra mới để cập nhật thông tin NFT
            let output =
              t.output(
                t.walletAddress(owner_address),
                assets.from_lovelace(0),
                InlineDatum(updatedNFT),
              )

            let tx =
              Transaction {
                inputs: [],
                outputs: [output],
                extra_signatories: [],
              }
            True
          }
        }
      }
      None -> fail
    }
  }

  // Tham gia hackathon
  join_hackathon(
    r: Redeemer,
    nftId: String,
    hackathonDay: String,
    tx: Transaction,
  ) {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum is {
      Some(currentNFT) ->
        // Kiểm tra nếu NFT chưa hết thời gian vesting
        if currentNFT.vesting_end > t.timestamp() {
          fail
        } else {
          // Kiểm tra ngày tham gia hackathon
          if currentNFT.day == hackathonDay {
            fail
          } else {
            // Cập nhật thông tin NFT và cộng điểm
            let updatedNFT =
              NFTData {
                name: currentNFT.name,
                day: hackathonDay,
                level: currentNFT.level,
                last_update: hackathonDay,
                point: currentNFT.point + 10,
                // Cộng điểm hackathon
                vesting_start: currentNFT.vesting_start,
                vesting_end: currentNFT.vesting_end,
              }

            // Tạo đầu ra mới để cập nhật thông tin NFT
            let output =
              t.output(
                t.walletAddress(owner_address),
                assets.from_lovelace(0),
                InlineDatum(updatedNFT),
              )

            let tx =
              Transaction {
                inputs: [],
                outputs: [output],
                extra_signatories: [],
              }
            True
          }
        }
      None -> fail
    }
  }

  else(_) {
    fail
  }
}

test editNFT() {
  let tx = Transaction { inputs: [], outputs: [], extra_signatories: [] }

  nft.edit_nft(OneMint, "nft_1", "20240101", 20, tx)
}

test addPoint() {
  let tx = Transaction { inputs: [], outputs: [], extra_signatories: [] }

  nft.add_point(OneMint, "nft_1", 30, tx)
}

test withdrawPoint() {
  let tx = Transaction { inputs: [], outputs: [], extra_signatories: [] }

  nft.withdraw_point(OneMint, "nft_1", 10, tx)
}
