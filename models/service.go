package models

import (
	"blog/observer"
	// "fmt"
	"github.com/astaxie/beego"
	"github.com/go-xorm/xorm"
	"strings"
	"time"
)

var dispatcher *observer.Dispatcher

func initObserver() {
	dispatcher = observer.SharedDispatcher()

	var cb observer.EventCallback = onSaveBlogForTag
	dispatcher.AddEventListener("saveBlog", &cb)

	var cb1 observer.EventCallback = onSaveBlogForMsg
	dispatcher.AddEventListener("saveBlog", &cb1)

	var cb2 observer.EventCallback = onSaveBlogForScore
	dispatcher.AddEventListener("saveBlog", &cb2)

	var cb3 observer.EventCallback = onSaveBlogForCategory
	dispatcher.AddEventListener("saveBlog", &cb3)
}

func onSaveBlogForTag(event *observer.Event) {
	params := event.Params
	session := params["session"].(*xorm.Session)
	blog := params["blog"].(*Blog)
	beego.Debug("evt-tag:", blog.Tag)
	tags := strings.Split(blog.Tag, ",")
	for _, tag := range tags {
		beego.Trace(session.IsCommitedOrRollbacked)
		_, err := session.Insert(&Tag{Name: tag, Uid: blog.Uid, Created: time.Now()})
		if err != nil {
			continue
		}
	}
}

func onSaveBlogForMsg(event *observer.Event) {
	beego.Debug("evt-msg:", event.Params["blogId"])
}

func onSaveBlogForScore(event *observer.Event) {
	beego.Debug("evt:", event.Params["blogId"])
}

func onSaveBlogForCategory(event *observer.Event) {
	beego.Debug("evt-category:", event.Params["blog"])
	params := event.Params
	session := params["session"].(*xorm.Session)
	blog := params["blog"].(*Blog)
	_, err := session.Insert(&UserCategory{Uid: blog.Uid, CategoryId: blog.CategoryId})
	if err != nil {
		// 已经存在该category,则不保存
		return
	}
}
