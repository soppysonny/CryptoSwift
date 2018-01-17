let encrypted = try Rabbit(key: key, iv: iv).encrypt(message)
let decrypted = try Rabbit(key: key, iv: iv).decrypt(encrypted)