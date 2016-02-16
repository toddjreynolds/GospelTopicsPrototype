//
//  TranslationBOMViewController.swift
//  GospelTopicsPrototype
//
//  Created by Todd Reynolds on 3/3/15.
//  Copyright (c) 2015 toddjreynolds. All rights reserved.
//

import UIKit

class TranslationBOMViewController: UIViewController {

    @IBOutlet var navLibrary: DesignableView!
    @IBOutlet var navBookOfMormon: DesignableView!
    @IBOutlet var navRestoration: DesignableView!
    @IBOutlet var navGospelTopics: DesignableView!
    @IBOutlet var navTranslation: UIView!
    @IBOutlet var scrollView: UIScrollView!
    @IBOutlet var iconBack: UIImageView!
    @IBOutlet var iconSearch: UIImageView!
    @IBOutlet var iconPages: UIImageView!
    @IBOutlet var iconBookmarks: UIImageView!
    @IBOutlet var iconForward: UIImageView!
    @IBOutlet var mainTitleBoxView: DesignableView!
    @IBOutlet var maskView: UIView!
    
    
    @IBAction func titleButtonIsPressed(sender: AnyObject) {
        self.mainTitleBoxView.backgroundColor = UIColor.clearColor()
        
        SpringAnimation.springEaseInOut(0.45, animations: {
            self.navTranslation.frame = CGRectMake(0, 196, 768, 44)
            self.navBookOfMormon.transform = CGAffineTransformMakeTranslation(0, 132)
            self.navRestoration.transform = CGAffineTransformMakeTranslation(0, 88)
            self.navGospelTopics.transform = CGAffineTransformMakeTranslation(0, 44)
            self.scrollView.transform = CGAffineTransformMakeTranslation(0, 176)
            self.mainTitleBoxView.transform = CGAffineTransformMakeTranslation(0, -18)
            
            self.maskView.hidden = false
            self.iconBack.hidden = true
            self.iconForward.hidden = true
            self.iconBookmarks.hidden = true
            self.iconSearch.hidden = true
            self.iconPages.hidden = true

            
        })
    }

    @IBAction func gospelTopicsIsPressed(sender: AnyObject) {
        SpringAnimation.springEaseInOut(0.45, animations: {
            self.navTranslation.frame = CGRectMake(0, 1024, 768, 44)
            self.navBookOfMormon.transform = CGAffineTransformMakeTranslation(0, 1024)
            self.navRestoration.transform = CGAffineTransformMakeTranslation(0, 1024)
            self.navGospelTopics.transform = CGAffineTransformMakeTranslation(0, -20)
            self.scrollView.transform = CGAffineTransformMakeTranslation(0, 1024)
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
    

}
