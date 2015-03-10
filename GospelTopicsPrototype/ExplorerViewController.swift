//
//  ExplorerViewController.swift
//  GospelTopicsPrototype
//
//  Created by Todd Reynolds on 3/9/15.
//  Copyright (c) 2015 toddjreynolds. All rights reserved.
//

import UIKit

class ExplorerViewController: UIViewController {

    @IBOutlet var webView: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = NSBundle.mainBundle().URLForResource("www/index", withExtension: "html")
        let myRequest = NSURLRequest(URL: url!)
        webView.loadRequest(myRequest)

        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }

}
