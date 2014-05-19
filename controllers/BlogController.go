package controllers

import (
	// "blog/models"
	"github.com/astaxie/beego"
)

type BlogController struct {
	baseController
}

func (this *BlogController) Posting() {
	beego.Trace("posting blog")
	this.TplNames = "blog_add.html"
}
