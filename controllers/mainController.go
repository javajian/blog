package controllers

type MainController struct {
	baseController
}

func (this *MainController) Login() {

	this.Data["Login"] = true
	this.TplNames = "login.html"
}

func (this *MainController) Index() {

	this.Data["Index"] = true
	this.TplNames = "index.html"
}

func (this *MainController) Home() {

	this.Data["Home"] = true
	this.TplNames = "home.html"
}

func (this *MainController) About() {

	this.Data["About"] = true
	this.TplNames = "about.html"
}

func (this *MainController) Contact() {

	this.Data["Contact"] = true
	this.TplNames = "contact.html"
}
