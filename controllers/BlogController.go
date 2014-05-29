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

func (this *BlogController) Post() {
	result := make(map[string]interface{})
	result["succ"] = "succ"
	// category	2
	// content	<p>dasdsa<br/></p>
	// contentText	dasdsa
	// tag	dsa,dddd,aaa
	// title	afsfsfdsfdssfds
	category, _ := this.GetInt("category")
	content := this.GetString("content")
	contentText := this.GetString("contentText")
	tag := this.GetString("tag")
	title := this.GetString("title")
	// save blog
	beego.Trace(category, content, contentText, tag, title)

	this.Data["json"] = result
	this.ServeJson()
}
