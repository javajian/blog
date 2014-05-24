package controllers

import (
	// "blog/models"
	"blog/helper"
	"encoding/json"
	"github.com/astaxie/beego"
	"os"
	"path"
	"strconv"
	"strings"
	"time"
)

type UploadController struct {
	baseController
}

func (this *UploadController) Upload() {
	beego.Trace("upload file")
	callback := this.GetString("callback")
	beego.Debug(" -> ", callback)
	upArea := "upfile"
	upFileDir := "upfile/blogImg"
	_, fh, err := this.GetFile(upArea)
	if err != nil {
		beego.Error(err)
		this.Data["json"] = false
	}
	upfile := fh.Filename // 文件名
	beego.Info(upfile)
	ext := helper.Substr(upfile, strings.LastIndex(upfile, "."), len(upfile), "") // 文件后缀

	toFile := path.Join(upFileDir, strconv.FormatInt(time.Now().UnixNano(), 10)+ext)
	err = this.SaveToFile(upArea, toFile)
	if err != nil {
		beego.Info(err)
		this.Data["json"] = false
	}

	of, err := os.Open(toFile)
	defer of.Close()

	fi, err := of.Stat()
	beego.Debug(fi.Name())
	beego.Debug(fi.ModTime())
	beego.Debug(fi.Size())
	beego.Debug(ext)
	beego.Debug(toFile)
	beego.Debug("SUCCESS")

	result := make(map[string]interface{})
	result["originalName"] = fi.Name()
	result["name"] = fi.Name()
	result["size"] = strconv.FormatInt(fi.Size(), 10)
	result["url"] = toFile
	result["type"] = ext
	result["state"] = "SUCCESS"

	if callback != "" {
		beego.Info("callback is not nil")
	} else {
		beego.Info("callback is nil")
		// this.Data["json"] = result
		// this.ServeJson()
		b, _ := json.Marshal(result)
		this.Ctx.Output.Header("Content-Type", "text/html")
		this.Ctx.Output.Body(b)
	}
}
