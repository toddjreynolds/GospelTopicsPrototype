//
//  RestorationViewController.swift
//  GospelTopicsPrototype
//
//  Created by Todd Reynolds on 3/3/15.
//  Copyright (c) 2015 toddjreynolds. All rights reserved.
//

import UIKit
import AVKit
import AVFoundation


class RestorationViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if let destination = segue.destinationViewController as? AVPlayerViewController {
            
            let url = NSBundle.mainBundle().URLForResource("The Restoration", withExtension: "m4v")
            destination.player = AVPlayer(URL: url)
        }
    }


}
