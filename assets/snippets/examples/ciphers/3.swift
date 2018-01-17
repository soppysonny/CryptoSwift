let encrypted = try Blowfish(key: key, blockMode: .CBC(iv: iv), padding: .pkcs7).encrypt(message)
let decrypted = try Blowfish(key: key, blockMode: .CBC(iv: iv), padding: .pkcs7).decrypt(encrypted)