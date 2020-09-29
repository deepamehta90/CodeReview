var LoginUserEmail;

$(document).ready(function () {
getLogedInUser();
loadTable();

/*var modal = document.getElementById("myModal");
	var span = document.getElementsByClassName("close")[0];
			
	window.onclick = function(event) {
	  if (event.target == modal) {
	    modal.style.display = "none";
	  }
	}
	
	
	span.onclick = function() {
	  modal.style.display = "none";
	}

*/
$(document).on('click','#Exporttoexcel',function(e){
fnExcelReport();
});

$(document).on('click','#MyTelephoneClaims',function(e){
window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MyMobileClaims.aspx";
});
});

function getLogedInUser(){
		$.ajax({
					url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser",
					type: "GET",
					async:false,
					headers: {
						"accept": "application/json;odata=verbose",
					},
					success: function (data){
							LoginUserEmail= data.d.Email;
							userDisplayName=data.d.Title;
							//GetAllTravelData(LoginUserEmail);						
					}, //success context
					error: function (error) {		
					},
		}); //end Ajax
}

function loadTable(){
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items?$filter=EmpEmail eq '"+LoginUserEmail+"'&$top=4999&$orderby=ID desc";

var tableContent = "";
var tableContents = "";
var tableContentForReport="";
$.ajax({        url: requestUrl,
        async: false,
        type: "GET",
        headers: {
        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        var objItems = data.d.results;
        tableContents = '<table id="example" class="display table-bordered" style="width:100%;text-align: center;" ><thead><tr ><th scope="col">Claim ID</th><th scope="col">Employee Name</th><th scope="col">Manager Name</th><th scope="col">Claim Status</th><th scope="col">Pending With</th><th scope="col">Claim Date</th><th scope="col">Claimed INR</th><th scope="col">View Claim</th><th scope="col">Delete</th><th scope="col">Print Claim</th></tr></thead><tbody>';
        
        if(objItems.length == 0)
        {
        document.getElementById("note").style.display = "block";
        //document.getElementById("Exporttoexcel").disabled = true;
        document.getElementById("MyClaims").style.display = "none";
        }
        else
        {
        document.getElementById("note").style.display = "none";
        //document.getElementById("Exporttoexcel").disabled = false;
        document.getElementById("MyClaims").style.display = "block";

        for (var i = 0; i < objItems.length; i++) {

        tableContent += '<tr>';
        var ItemID=objItems[i].ID;
	        if(ItemID != null && ItemID != "" ){
	        		//Claim ID
                  if(objItems[i].ID != null && objItems[i].ID != "" ){
	            		tableContent += '<td>CCD'+objItems[i].ID+'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Employee Name
                  if(objItems[i].EmpName != null && objItems[i].EmpName != "" ){
	            		tableContent += '<td>'+objItems[i].EmpName +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Manager Name
                  if(objItems[i].ManagerName != null && objItems[i].ManagerName != "" ){
	            		tableContent += '<td>'+objItems[i].ManagerName +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Status
                  if(objItems[i].Status != null && objItems[i].Status != "" ){
                  		if(objItems[i].Status == "Pending")
	            		tableContent += '<td>'+objItems[i].Status +'</td>';
	            		else if(objItems[i].Status == "Rejected")
	            		tableContent += '<td style="color:red">'+objItems[i].Status +'</td>';
	            		else if(objItems[i].Status == "Referred Back")
	            		tableContent += '<td style="color:orange">'+objItems[i].Status +'</td>';
	            		else if(objItems[i].Status == "Approved")
	            		tableContent += '<td style="color:#179217">'+objItems[i].Status +'</td>';
	            		else if(objItems[i].Status == "Amount Disbursed")
	            		tableContent += '<td style="color:#179217">'+objItems[i].Status +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//PendingWith
                  if(objItems[i].PendingWith != null && objItems[i].PendingWith != "" ){
	            		tableContent += '<td>'+objItems[i].PendingWith+'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Created
                  if(objItems[i].ClaimDate != null && objItems[i].ClaimDate != "" ){
	            		tableContent += '<td>'+objItems[i].ClaimDate+'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Claimed INR
                  if(objItems[i].TotalClaimedAmount != null && objItems[i].TotalClaimedAmount != "" ){
	            		tableContent += '<td>'+objItems[i].TotalClaimedAmount +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	/*//Approved INR
                  if(objItems[i].TotalApprovedAmount != null && objItems[i].TotalApprovedAmount != "" ){
	            		tableContent += '<td>'+objItems[i].TotalApprovedAmount +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}*/
	            	
	            	//Claim ID - view
                  if(objItems[i].ID != null && objItems[i].ID != "" ){
	            		tableContent += '<td><a href="/sites/Finance/ExpenseClaimSystem/SitePages/ViewOtherExpense.aspx?User?'+objItems[i].ID+'" target="blank"><i class="fa fa-eye" aria-hidden="true" style="font-size: 16px;"></i></a></td>';
	            	//tableContent += '<td></td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}


//Claim ID-delete
                  if(objItems[i].ID != null && objItems[i].ID != "" ){
                  		if(objItems[i].Status == "Pending" && objItems[i].PendingWith == objItems[i].ManagerName)
                  		{
                  		//tableContent += '<td><a href="/sites/Finance/ExpenseClaimSystem/SitePages/DeleteClaim.aspx?'+objItems[i].ID+'" target="blank">Delete Claim</a></td>';
	tableContent += '<td ><i class="fa fa-trash" style="font-size: 16px;" onclick=DeleteClaim('+objItems[i].ID+')></i"></td>';

                  		}
                  		else
	            		tableContent += '<td style="color:red"><b>Cannot Delete</b></td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

//Claim ID-print
                  if(objItems[i].ID != null && objItems[i].ID != "" ){
	            		if(objItems[i].Status == "Pending" && objItems[i].PendingWith == "Submission And Verification")
                  		{
                  		tableContent += '<td><a href="/sites/Finance/ExpenseClaimSystem/SitePages/ViewOtherExpense.aspx?User?'+objItems[i].ID+'?print" target="blank"><i class="fa fa-print" style="font-size: 16px;"></i></a></td>';
                  		}
                  		else
	            		tableContent += '<td style="color:red"><b>Cannot Print</b></td>';
	            		
	            		
	            		//attachment
	            	/*	if(objItems[i].Attachments == true){
                		tableContent += '<td><a class="downloadFiles">View Attachments</a></td>';                	
                	}else{
                		tableContent += '<td>No attachments</td>';
                	}*/


	            	}
	            	else{
	            		tableContent += '<td></td>';
	            	}

	            	tableContent += '</tr>';
	        }
        }
}
        },
        error: function(data) {
            //alert("Error occured");
            saveErrorList(pageName, "N/A", "loadTable()", data.responseJSON.error.code);
        } //end of error
    });//end of ajax
tableContent += '</tbody>'; 
    tableContent += '</table>';  
    tableContents += tableContent;         
    $('#formGrid').append(tableContents);
  $('#example thead tr').clone(true).appendTo( '#example thead' );
	$('#example thead tr:eq(0) th').each( function (i) {
	var title = $(this).text();
	
	$(this).html( '<input type="text" placeholder="Search '+title+'" style="width:100%;padding: 1px 1px;"/>' );
     			
    $( 'input', this ).on( 'keyup change', function () {
        if ( table.column(i).search() !== this.value ) {
            table
                .column(i)
                .search( this.value )
                .draw();
        }
    } );
} );
  
  var table = $('#example').DataTable( {
     responsive: true,
    "bDestroy": true,
    "bProcessing": true,
	"autoWidth": false,
	"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
	"order": [[ 0, "desc" ]]
  } );
  $("#example").wrap('<div style="width:100%;overflow:auto;"></div>');

} //end of loadTable

	
$(document).on('click','.downloadFiles',function(){
						$("#fileAttached").html('');
						var attachmentFiles = "";
                		var $row = $(this).closest("tr");    // Find the row
                		debugger;				    
						ID = $row.find("td:nth-child(1)").text().split('D')[1];
						//alert(ID);
						var name = attachementFetch(ID);
						
						attachmentFiles += '<ol type="1">';
						for(var i=0; i<name.length; i++){
							attachmentFiles += '<li><a href="' + name[i].ServerRelativeUrl  + '">'+ name[i].FileName + '</a></li>';
							//attachmentFiles += '<br>';
						}
						attachmentFiles += '</ol>';

						$("#fileAttached").append(attachmentFiles);
						//alert(attachmentFiles)
						    
    bootbox.alert(""+attachmentFiles+"", function(){ 
    				//window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/MyClaims.aspx";
				});
						//$("#myModal").toggle();
                	})	
                	
function attachementFetch(id) {
              var image = [];
			var call = $.ajax({
			        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + id + ")/AttachmentFiles",
			        type: "GET",
			        dataType: "json",
					async: false,
			        headers: {
						"accept": "application/json; odata=verbose"
			        },
			    });
			
			    call.done(function (data,textStatus, jqXHR){
					debugger;
					if(data.d.results.length != 0){
						var imageItems = data.d.results;
			                    if (data.d.results.length != 0) {
			                        image = imageItems;
			                    } else {
			                        image = "";
			                    }
			
			        }
			    });
			        
			        call.fail(function (jqXHR,textStatus,errorThrown){
			            //alert("Error retrieving Tasks: " + jqXHR.responseText);
			        });
						return image;

        }	

function DeleteClaim(ID)
{
    if ((ID.length < 1) || isNaN(ID)) {  
        bootbox.alert("Please select a valid claim ID to delete.");  
    } else {  
    
    bootbox.confirm({
    title: "",
    message: "Are you sure to delete CCD"+ID+"?",
    buttons: {
        cancel: {
            label: '<i class="fa fa-times"></i> Cancel'
        },
        confirm: {
            label: '<i class="fa fa-check"></i> Confirm'
        }
    },
    callback: function (result) {
    if(result)
    {
       $.ajax({  
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + ID+ ")",  
            type: "POST",  
            contentType: "application/json;odata=verbose",  
            headers: {  
                "Accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE",  
            },  
            success: function(data) {  
            deleteClaimDetails("CCD"+ID);
            
                          },  
            error: function(data) {  
                alert("failed");  
            }  
        });
        }
    }
});
   }
}

function deleteClaimDetails(claimID)
	{
	debugger;
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items?$filter=ClaimID eq '"+claimID+"'&$top=4999";

var tableContent = "";
var tableContents = "";
var tableContentForReport="";
$.ajax({
        url: requestUrl,
        async: false,
        type: "GET",
        headers: {        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        	var objItems = data.d.results;
        	if(objItems.length > 0)
        	{
        		for(var i=0;i<objItems.length;i++)
        		{
        			var detailsID = data.d.results[i].ID;
        			$.ajax({  
            		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimDetails')/items(" + detailsID + ")",  
            type: "POST",  
            contentType: "application/json;odata=verbose",  
            headers: {  
                "Accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE",  
            },  
            success: function(data) {  
              },  
            error: function(data) {  
                bootbox.alert("failed");  
            }  
        });//end of inner ajx
        		}//end of for
        	}//end of if greater zero item
        	deleteHistory(claimID);
         },//end of success
        error: function(err) {
             bootbox.alert("Error Occured while deleteing details."+err)
        }
        });
}

function deleteHistory(claimID)
	{
	debugger;
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimHistory')/items?$filter=ClaimID eq '"+claimID+"'&$top=4999";

var tableContent = "";
var tableContents = "";
var tableContentForReport="";
$.ajax({
        url: requestUrl,
        async: false,
        type: "GET",
        headers: {        	
            "accept": "application/json; odata=verbose"
        },
        success: function(data) {
        	var objItems = data.d.results;
        	if(objItems.length > 0)
        	{
        		for(var i=0;i<objItems.length;i++)
        		{
        			var detailsID = data.d.results[i].ID;
        			$.ajax({  
            		url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaimHistory')/items(" + detailsID + ")",  
            type: "POST",  
            contentType: "application/json;odata=verbose",  
            headers: {  
                "Accept": "application/json;odata=verbose",  
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE",  
            },  
            success: function(data) {  
            
              },  
            error: function(data) {  
                bootbox.alert("Error Occured while deleting history.");  
            }  
        });//end of inner ajx
        		}//end of for
        	}//end of if greater zero item
        	bootbox.alert("Claim ID "+claimID+" deleted successfully.", function(){ 
    				
    				location.reload();				
    				});
         },//end of success
        error: function(err) {
             bootbox.alert("Error Occured while deleting history."+err)
        }
        });
}



function fnExcelReport()
{
    var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
    var textRange; var j=0;
    //tab = document.getElementById('example'); // id of table
    tab = document.getElementById('example');
    //tab = document.getElementById('myRequestTable');
    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>"; 
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params
    
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 
    
    var edge = ua.indexOf('Edge/');
    var trident = ua.indexOf('Trident/');
  
    if (msie > 0 || edge > 0 || trident > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        
      if (typeof Blob !== "undefined") {
        //use blobs if we can
        tab_text = [tab_text];
        //convert to array
        var blob1 = new Blob(tab_text, {
          type: "text/html"
        });
        window.navigator.msSaveBlob(blob1, "MyClaims.xls");
      } else {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "MyClaims.xls");
        return (sa);
      }    
    }  
    else
        {
            var filename = "MyClaims";
            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            a.href = data_type + ', ' + encodeURIComponent(tab_text);
            a.download = filename + '.xls';
            a.click();  
        }
}