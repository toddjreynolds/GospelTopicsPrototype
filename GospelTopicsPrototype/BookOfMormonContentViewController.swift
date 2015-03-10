//
//  BookOfMormonContentViewController.swift
//  GospelTopicsPrototype
//
//  Created by Todd Reynolds on 3/2/15.
//  Copyright (c) 2015 toddjreynolds. All rights reserved.
//

import UIKit
import AVKit
import AVFoundation

class BookOfMormonContentViewController: UIViewController {

    @IBOutlet var sidebarTreeView: DesignableView!
    @IBOutlet var navTitleButton: DesignableButton!
    @IBOutlet var iconPagesImageView: UIImageView!
    @IBOutlet var iconSearchImageView: UIImageView!
    @IBOutlet var iconBookmarksImageView: UIImageView!
    @IBOutlet var toolbarView: DesignableView!
    @IBOutlet var rcaButton: UIButton!
    @IBOutlet var maskButton: UIButton!
    
    @IBAction func maskButtonPressed(sender: AnyObject) {
        springEaseInOut(0.3, {
            self.sidebarTreeView.transform = CGAffineTransformMakeTranslation(320, 0)
            self.maskButton.alpha = 0
        })


    }
    @IBAction func rcaButtonPressed(sender: AnyObject) {
        sidebarTreeView.hidden = false
        sidebarTreeView.transform = CGAffineTransformMakeTranslation(320, 0)
        
        springEaseInOut(0.3, {
            self.sidebarTreeView.transform = CGAffineTransformMakeTranslation(0, 0)
//            self.toolbarView.frame = CGRectMake(0, 980, 768-320, 44)
//            self.rcaButton.transform = CGAffineTransformMakeTranslation(-320, 0)
//            self.iconBookmarksImageView.transform = CGAffineTransformMakeTranslation(-320, 0)
//            self.iconPagesImageView.transform = CGAffineTransformMakeTranslation(-320, 0)
//            self.iconSearchImageView.transform = CGAffineTransformMakeTranslation(-320, 0)
//            self.navTitleButton.transform = CGAffineTransformMakeTranslation(-200, 0)
            self.maskButton.alpha = 0.3
            
        })

    }
    @IBAction func backButtonPressed(sender: AnyObject) {
        
    }
    @IBAction func closeSidebarPressed(sender: AnyObject) {
        springEaseInOut(0.3, {
            self.sidebarTreeView.transform = CGAffineTransformMakeTranslation(320, 0)
//            self.toolbarView.frame = CGRectMake(0, 980, 768, 44)
//            self.rcaButton.transform = CGAffineTransformMakeTranslation(0, 0)
//            self.iconBookmarksImageView.transform = CGAffineTransformMakeTranslation(0, 0)
//            self.iconPagesImageView.transform = CGAffineTransformMakeTranslation(0, 0)
//            self.iconSearchImageView.transform = CGAffineTransformMakeTranslation(0, 0)
//            self.navTitleButton.transform = CGAffineTransformMakeTranslation(0, 0)
            self.maskButton.alpha = 0
        })
    }
    
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
            
            if segue.identifier == "playEternalPerspectiveSegue" {
        
                let url = NSBundle.mainBundle().URLForResource("BOMEternalPerspective", withExtension: "m4v")
                destination.player = AVPlayer(URL: url)
            }
            
            else if segue.identifier == "playNephiCinemagraphSegue" {
                let url = NSBundle.mainBundle().URLForResource("NephiCinemagraph", withExtension: "m4v")
                destination.player = AVPlayer(URL: url)
            }
        }

    }
    

}
