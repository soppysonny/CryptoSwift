do {
  let aes = try AES(key: "passwordpassword", iv: "drowssapdrowssap") // aes128
  let ciphertext = try aes.encrypt(Array("Nullam quis risus eget urna mollis ornare vel eu leo.".utf8))
} catch { }