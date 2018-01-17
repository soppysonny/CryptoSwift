do {
  var encryptor = try AES(key: "passwordpassword", iv: "drowssapdrowssap").makeEncryptor()

  var ciphertext = Array<UInt8>()
  // aggregate partial results
  ciphertext += try encryptor.update(withBytes: Array("Nullam quis risus ".utf8))
  ciphertext += try encryptor.update(withBytes: Array("eget urna mollis ".utf8))
  ciphertext += try encryptor.update(withBytes: Array("ornare vel eu leo.".utf8))
  // finish at the end
  ciphertext += try encryptor.finish()

  print(ciphertext.toHexString())
} catch {
  print(error)
}