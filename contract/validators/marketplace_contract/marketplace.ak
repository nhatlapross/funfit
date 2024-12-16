// use cardano/transaction.{Transaction, OutputReference, InlineDatum}
// use cardano/assets.{Asset, PolicyId}
// use aiken/collection/list
// use course/types.{MarketDatum, MBuy, MDelist}

// validator marketplace {

//   // Mua NFT
//   buy_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     // Kiểm tra NFT có tồn tại
//     when nftDatum is {
//         Some(updatedNFT) -> {
//           // Kiểm tra người mua đã trả đủ tiền (hoặc ADA)
//           // Logic giá trị trả dựa vào số lượng, ADA, hay token tương ứng
//           // Cập nhật trạng thái bán hàng và chuyển NFT cho người mua
//           let updatedNFT = nftDatum  // Đã mua xong NFT
//           let output = t.output(
//             t.walletAddress(#"buyer_wallet"),
//             assets.from_lovelace(0),
//             InlineDatum(updatedNFT)
//           )

//           let tx = Transaction {
//             inputs: [],
//             outputs: [output],
//             extra_signatories: [],
//           }
//           True
//       }
//       None -> fail
//     }
//   }

//   // Delist NFT khỏi marketplace
//   delist_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
//     let nftDatum = t.findDatumById(nftId)

//     // Kiểm tra nếu NFT tồn tại
//     when nftDatum is {
//       Some(nft) -> {
//         // Kiểm tra nếu người gọi là chủ sở hữu NFT
//         // Đảm bảo chỉ chủ sở hữu NFT mới có thể delist

//         let output = t.output(
//           t.walletAddress(#"owner_wallet"),
//           assets.from_lovelace(0),
//           InlineDatum(nft)
//         )

//         let tx = Transaction {
//           inputs: [],
//           outputs: [output],
//           extra_signatories: [],
//         }
//         True
//     }
//     None -> fail
//   }
// }

// test buyNFT() {
//   let tx = Transaction {
//     inputs: [],
//     outputs: [],
//     extra_signatories: [],
//   }

//   marketplace.buy_nft(MBuy, "nft_1", tx)
// }

// test delistNFT() {
//   let tx = Transaction {
//     inputs: [],
//     outputs: [],
//     extra_signatories: [],
//   }

//   marketplace.delist_nft(MDelist, "nft_1", tx)
// }


use cardano/transaction.{Transaction, OutputReference, InlineDatum, Redeemer}
use cardano/assets.{PolicyId}
use aiken/collection/list

validator marketplace {

  // Mua NFT
  buy_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
    // Kiểm tra NFT có tồn tại
    let nftDatum = tx.outputs |> List.filter(
      fun o |> o.datum == nftId
    )

    if List.is_empty(nftDatum) {
      fail // NFT không tồn tại
    } else {
      let updatedNFT = List.head(nftDatum)

      // Kiểm tra người mua đã trả đủ tiền (hoặc ADA)
      let payment = tx.inputs[0].value // Giả sử người mua trả tiền qua đầu vào giao dịch

      if payment >= updatedNFT.price {
        // Cập nhật trạng thái bán hàng và chuyển NFT cho người mua
        let output = tx.output(
          tx.walletAddress(#"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"),
          assets.from_lovelace(payment),
          InlineDatum(updatedNFT)
        )

        let tx = Transaction {
          inputs: [],
          outputs: [output],
          extra_signatories: [],
        }
        True
      } else {
        fail // Người mua chưa trả đủ tiền
      }
    }
  }

  // Delist NFT khỏi marketplace
  delist_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
    // Kiểm tra đầu ra giao dịch (outputs) để tìm Datum
    let nftDatum = tx.outputs |> List.filter(
      fun o |> o.datum == nftId
    )

    if List.is_empty(nftDatum) {
      fail // NFT không tồn tại
    } else {
      let nft = List.head(nftDatum)

      // Kiểm tra nếu người gọi là chủ sở hữu NFT
      let owner = nft.owner // Giả sử dữ liệu NFT chứa thông tin chủ sở hữu
      if owner == tx.walletAddress(#"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f51") {                                     
        let output = tx.output(
          tx.walletAddress(#"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f52"),                              
          assets.from_lovelace(0),
          InlineDatum(nft),
        )

        let tx = Transaction {
          inputs: [],
          outputs: [output],
          extra_signatories: [],
        }
        True
      } else {
        fail // Chỉ chủ sở hữu mới có quyền delist
      }
    }
  }
}

// Kiểm thử mua NFT
test buyNFT() {
  let tx = Transaction {
    inputs: [tx.input(tx.walletAddress(#"f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50"), assets.from_lovelace(1000000))],
    outputs: [],
    extra_signatories: [],
  }
  marketplace.buy_nft(MBuy, "nft_1", tx)
}

// Kiểm thử delist NFT
test delistNFT() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }
  marketplace.delist_nft(MDelist, "nft_1", tx)
}

