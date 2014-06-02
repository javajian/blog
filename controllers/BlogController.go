package controllers

import (
	"blog/helper"
	"blog/models"
	"github.com/astaxie/beego"
	"time"
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

	online_user := this.GetSession("online_user")
	uid, err := helper.FormatSessUid(online_user)
	if err != nil {
		result["succ"] = "err"
		result["msg"] = this.Tr("op_no_user")
		this.Data["json"] = result
		this.ServeJson()
	}

	category, _ := this.GetInt("category")
	content := this.GetString("content")
	// contentText := this.GetString("contentText")
	tag := this.GetString("tag")
	title := this.GetString("title")
	canComment, err := this.GetInt("canComment")
	if err != nil {
		beego.Error(err)
		canComment = 1
	}

	b := new(models.Blog)
	b.Title = title
	b.Content = content
	b.Uid = uid
	b.Created = time.Now()
	b.State = 1
	b.CanComment = int(canComment)
	b.Tag = tag
	b.CategoryId = category
	_, err = models.SaveBlog(b)
	if err != nil {
		beego.Error(err)
		result["succ"] = "err"
		result["msg"] = this.Tr("blog.save_err")
	} else {
		result["msg"] = this.Tr("blog.save_succ")
	}

	this.Data["json"] = result
	this.ServeJson()
}
