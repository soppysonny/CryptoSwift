let input: Array<UInt8> = [0,1,2,3,4,5,6,7,8,9]

let key: Array<UInt8> = [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]
let iv: Array<UInt8> = AES.randomIV(AES.blockSize)

do {
  let encrypted = try AES(key: key, blockMode: .CBC(iv: iv), padding: .pkcs7).encrypt(input)
  let decrypted = try AES(key: key, blockMode: .CBC(iv: iv), padding: .pkcs7).decrypt(encrypted)
} catch {
  print(error)
}    