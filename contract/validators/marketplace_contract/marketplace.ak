use cardano/transaction.{Transaction, OutputReference, InlineDatum}
use cardano/assets.{Asset, PolicyId}
use aiken/collection/list
use course/types.{MarketDatum, MBuy, MDelist}

validator marketplace {

  // Mua NFT
  buy_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra NFT có tồn tại
    when nftDatum != None {
      let nft = nftDatum

      // Kiểm tra người mua đã trả đủ tiền (hoặc ADA)
      // Logic giá trị trả dựa vào số lượng, ADA, hay token tương ứng

      // Cập nhật trạng thái bán hàng và chuyển NFT cho người mua
      let updatedNFT = nftDatum  // Đã mua xong NFT
      let output = t.output(
        t.walletAddress(#"buyer_wallet"),
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
      fail  // Không tìm thấy NFT
    }
  }

  // Delist NFT khỏi marketplace
  delist_nft(r: Redeemer, nftId: String, tx: Transaction) -> Bool {
    let nftDatum = t.findDatumById(nftId)

    // Kiểm tra nếu NFT tồn tại
    when nftDatum != None {
      let nft = nftDatum

      // Kiểm tra nếu người gọi là chủ sở hữu NFT
      // Đảm bảo chỉ chủ sở hữu NFT mới có thể delist

      let output = t.output(
        t.walletAddress(#"owner_wallet"),
        assets.from_lovelace(0),
        InlineDatum(nft)
      )

      let tx = Transaction {
        inputs: [],
        outputs: [output],
        extra_signatories: [],
      }

      True
    }
    else {
      fail  // Không tìm thấy NFT
    }
  }
}

test buyNFT() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  marketplace.buy_nft(MBuy, "nft_1", tx)
}

test delistNFT() {
  let tx = Transaction {
    inputs: [],
    outputs: [],
    extra_signatories: [],
  }

  marketplace.delist_nft(MDelist, "nft_1", tx)
}
