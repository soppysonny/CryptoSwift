let plain = Data(bytes: [0x01, 0x02, 0x03])
let encrypted = try! plain.encrypt(ChaCha20(key: key, iv: iv))
let decrypted = try! encrypted.decrypt(ChaCha20(key: key, iv: iv))