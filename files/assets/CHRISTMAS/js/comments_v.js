function post(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	var form = new FormData()
	form.append("formkey", formkey());
	xhr.withCredentials=true;
	xhr.send(form);
};

function post_toast3(url, button1, button2) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	var form = new FormData()
	form.append("formkey", formkey());

	if(typeof data === 'object' && data !== null) {
		for(let k of Object.keys(data)) {
				form.append(k, data[k]);
		}
	}


	form.append("formkey", formkey());
	xhr.withCredentials=true;

	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 300) {
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
			myToast.show();
			try {
				document.getElementById('toast-post-success-text').innerText = JSON.parse(xhr.response)["message"];
			} catch(e) {
				document.getElementById('toast-post-success-text').innerText = "Action successful!";
			}
			return true

		} else if (xhr.status >= 300 && xhr.status < 400) {
			window.location.href = JSON.parse(xhr.response)["redirect"]
		} else {

			try {
				data=JSON.parse(xhr.response);
			} catch(e) {}

			var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
			myToast.hide();
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
			myToast.show();
			return false
		}
	};

	xhr.send(form);

	document.getElementById(button1).classList.toggle("md:block");
	document.getElementById(button2).classList.toggle("md:block");
}

function report_commentModal(id, author) {

	document.getElementById("comment-author").textContent = author;

	document.getElementById("reportCommentButton").onclick = function() {

	this.innerHTML='Reporting comment';
	this.disabled = true;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", '/report/comment/'+id, true);
	var form = new FormData()
	form.append("formkey", formkey());
	form.append("reason", document.getElementById("reason-comment").value);

	xhr.withCredentials=true;

	xhr.onload=function() {
		document.getElementById("reportCommentFormBefore").classList.add('hidden');
		document.getElementById("reportCommentFormAfter").classList.remove('hidden');
	};

	xhr.onerror=function(){alert(errortext)};
	xhr.send(form);
}

};

function openReplyBox(id) {
	const element = document.getElementById(`reply-to-${id}`);
	element.classList.remove('hidden')

	element.getElementsByTagName('textarea')[0].focus()
}

function toggleEdit(id){
	comment=document.getElementById("comment-text-"+id);
	form=document.getElementById("comment-edit-"+id);
	box=document.getElementById('comment-edit-body-'+id);
	actions = document.getElementById('comment-' + id +'-actions');

	comment.classList.toggle("hidden");
	form.classList.toggle("hidden");
	actions.classList.toggle("hidden");
	autoExpand(box);
};


function delete_commentModal(id) {

	document.getElementById("deleteCommentButton").onclick = function() {	

		this.innerHTML='Deleting comment';	
		this.disabled = true; 

		var url = '/delete/comment/' + id
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		var form = new FormData()
		form.append("formkey", formkey());
		xhr.withCredentials=true;
		xhr.onload = function() {location.reload(true);};
		xhr.send(form);
}

};

function post_reply(id){

	var form = new FormData();

	form.append('formkey', formkey());
	form.append('parent_id', id);
	form.append('body', document.getElementById('reply-form-body-'+id).value);
	var xhr = new XMLHttpRequest();
	xhr.open("post", "/reply");
	xhr.withCredentials=true;
	xhr.onload=function(){
		if (xhr.status==200) {
			commentForm=document.getElementById('comment-form-space-'+id);
			commentForm.innerHTML = xhr.response.replace(/data-src/g, 'src').replace(/data-cfsrc/g, 'src').replace(/style="display:none;visibility:hidden;"/g, '');
		}
		else {
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
			myToast.hide();
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
			myToast.show();
			try {document.getElementById('toast-post-error-text').innerText = JSON.parse(xhr.response)["error"];}
			catch {}
		}
	}
	xhr.send(form)
}

function comment_edit(id){

	var form = new FormData();

	form.append('formkey', formkey());
	form.append('body', document.getElementById('comment-edit-body-'+id).value);
	form.append('file', document.getElementById('file-edit-reply-'+id).files[0]);

	var xhr = new XMLHttpRequest();
	xhr.open("post", "/edit_comment/"+id);
	xhr.withCredentials=true;
	xhr.onload=function(){
		if (xhr.status==200) {
			commentForm=document.getElementById('comment-text-'+id);
			commentForm.innerHTML = xhr.response.replace(/data-src/g, 'src').replace(/data-cfsrc/g, 'src').replace(/style="display:none;visibility:hidden;"/g, '');
			document.getElementById('cancel-edit-'+id).click()
		}
		else {
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
			myToast.hide();
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
			myToast.show();
			try {document.getElementById('toast-post-error-text').innerText = JSON.parse(xhr.response)["error"];}
			catch {}
		}
	}
	xhr.send(form)
}

function post_comment(fullname){
	const btn = document.getElementById('save-reply-to-'+fullname)
	btn.classList.add('disabled');

	var form = new FormData();

	form.append('formkey', formkey());
	form.append('parent_fullname', fullname);
	form.append('submission', document.getElementById('reply-form-submission-'+fullname).value);
	form.append('body', document.getElementById('reply-form-body-'+fullname).value);
	form.append('file', document.getElementById('file-upload-reply-'+fullname).files[0]);

	var xhr = new XMLHttpRequest();
	xhr.open("post", "/comment");
	xhr.withCredentials=true;
	xhr.onload=function(){
		if (xhr.status==200) {
			commentForm=document.getElementById('comment-form-space-'+fullname);
			commentForm.innerHTML = xhr.response.replace(/data-src/g, 'src').replace(/data-cfsrc/g, 'src').replace(/style="display:none;visibility:hidden;"/g, '');
		}
		else {
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
			myToast.hide();
			var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
			myToast.show();
			try {document.getElementById('toast-post-error-text').innerText = JSON.parse(xhr.response)["error"];}
			catch {}
			btn.classList.remove('disabled');
		}
	}
	xhr.send(form)
}

document.onpaste = function(event) {
	var focused = document.activeElement;
	if (focused.id.includes('reply-form-body-')) {
		var fullname = focused.dataset.fullname;
		f=document.getElementById('file-upload-reply-' + fullname);
		files = event.clipboardData.files
		filename = files[0].name.toLowerCase()
		if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".webp") || filename.endsWith(".gif"))
		{
			f.files = files;
			document.getElementById('filename-show-reply-' + fullname).textContent = filename;
		}
	}
	else if (focused.id.includes('comment-edit-body-')) {
		var id = focused.dataset.id;
		f=document.getElementById('file-edit-reply-' + id);
		files = event.clipboardData.files
		filename = files[0].name.toLowerCase()
		if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".webp") || filename.endsWith(".gif"))
		{
			f.files = files;
			document.getElementById('filename-edit-reply-' + id).textContent = filename;
		}
	}
	else if (focused.id.includes('post-edit-box-')) {
		var id = focused.dataset.id;
		f=document.getElementById('file-upload-edit-' + id);
		files = event.clipboardData.files
		filename = files[0].name.toLowerCase()
		if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".webp") || filename.endsWith(".gif"))
		{
			f.files = files;
			document.getElementById('filename-show-edit-' + id).textContent = filename;
		}
	}
}

function poll_vote(cid, parentid) {
	for(let el of document.getElementsByClassName('presult-'+parentid)) {
		el.classList.remove('d-none');
	}
	for(let el of document.getElementsByClassName('presult')) {
		el.classList.remove('d-none');
	}
	var type = document.getElementById(cid).checked;
	var scoretext = document.getElementById('poll-' + cid);
	var score = Number(scoretext.textContent);
	if (type == true) scoretext.textContent = score + 1;
	else scoretext.textContent = score - 1;
	post('/vote/poll/' + cid + '?vote=' + type);
}