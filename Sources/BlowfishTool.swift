//
//  BlowfishTool.swift
//  VPN
//
//  Created by zhang ming on 2018/5/7.
//  Copyright © 2018年 小叶科技. All rights reserved.
//

import Foundation
public class BlowfishTool: NSObject {
    var key : String!
    public override init() {
        super.init()
    }
    
    public func getBlowfish(key:String!) -> BlowfishTool {
        let tool = BlowfishTool()
        tool.key = key
        return tool
    }
    
    public func blowfishDecrypt(data:Data) -> Data? {
        do {
            let uintArr:[UInt8] = try Blowfish.init(key: key.data(using: .utf8)!.bytes, blockMode: ECB(), padding: .pkcs5).decrypt(data)
            let data = Data.init(bytes: uintArr)
            return data
        } catch _ {
            return nil
        }
    }
    
    public func blowfishEncrypt(data:Data) -> Data? {
        do {
            let uintArr:[UInt8] = try Blowfish.init(key: key.data(using: .utf8)!.bytes, blockMode: ECB(), padding: .pkcs5).encrypt(data)
            let data = Data.init(bytes: uintArr)
            return data
        } catch _ {
            return nil
        }
    }
}
