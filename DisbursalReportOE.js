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
window.location.href = "/sites/Finance/ExpenseClaimSystem/SitePages/DisbursalReportMobile.aspx";
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
debugger;
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items?$filter=(PendingWith eq 'Approved' and AmountDisbursed eq 'No')&$top=4999";

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
        tableContents = '<table id="example" class="display table-bordered" style="width:100%;"><thead><tr><th scope="col"></th><th scope="col">Claim ID</th><th scope="col">Employee Name</th><th scope="col">Employee Code</th><th scope="col">Amount</th><th scope="col">Bank Name</th><th scope="col">Account Number</th><th scope="col">IFSC</th></tr></thead><tbody>';
        
        if(objItems.length == 0)
        {
        document.getElementById("note").style.display = "block";
        document.getElementById("Exporttoexcel").disabled = true;
        document.getElementById("MyClaims").style.display = "none";
        }
        else
        {
        document.getElementById("note").style.display = "none";
        document.getElementById("Exporttoexcel").disabled = false;
        document.getElementById("MyClaims").style.display = "block";

        for (var i = 0; i < objItems.length; i++) {
        tableContent += '<tr>';
        var ItemID=objItems[i].ID;
	        if(ItemID != null && ItemID != "" ){
	        tableContent += '<td><input type="checkbox" name="checkboxClaim"></td>';

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
                  if(objItems[i].EmpCode != null && objItems[i].EmpCode != "" ){
	            		tableContent += '<td>'+objItems[i].EmpCode+'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            		            	
	  	            	
	            	//Claimed INR
                  if(objItems[i].TotalClaimedAmount != null && objItems[i].TotalClaimedAmount != "" ){
	            		tableContent += '<td>'+objItems[i].TotalClaimedAmount +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

//Claimed INR
                  if(objItems[i].BankName != null && objItems[i].BankName != "" ){
	            		tableContent += '<td>'+objItems[i].BankName +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

//Claimed INR
                  if(objItems[i].AccountNumber != null && objItems[i].AccountNumber != "" ){
	            		tableContent += '<td>'+objItems[i].AccountNumber +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

//Claimed INR
                  if(objItems[i].IFSC != null && objItems[i].IFSC != "" ){
	            		tableContent += '<td>'+objItems[i].IFSC +'</td>';
	            	}else{
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
  } );
  $("#example").wrap('<div style="width:100%;overflow:auto;"></div>');

} //end of loadTable

$(document).on('click','#btnDisburse',function(){
	var grid = document.getElementById("example");
	var checkBoxes = grid.getElementsByTagName("INPUT");
	var message ="";
	var LengthCheckBox=checkBoxes.length;
	var a=true;
	var claimsRejected ="";
	if($('input[name="checkboxClaim"]').is(':checked')){
	for (var i = 0; i < checkBoxes.length; i++) {
	if (checkBoxes[i].checked) {
		a=false;
		var row = checkBoxes[i].parentNode.parentNode;

		var claimID = (row.cells[1].innerHTML).split("D")[1];
		

		claimsRejected = claimsRejected +", "+row.cells[1].innerHTML;
		//alert(claimID+managerRemarks )
		$(".modal1").show();
		setTimeout(function() {
		UpdateClaim(claimID,"","","");
		 }, 100);
		}		
	}
	
	bootbox.alert("Claims "+claimsRejected +" marked under Amount Disbursed.", function(){ 
	location.reload(); });
	}
	else
	{
	bootbox.alert("Kindly select atleast one Claim ID");
	}
})


function UpdateClaim(claimID,managerRemarks,status,approvedamt){
		var item = {
		    "__metadata": {
		        "type": "SP.Data.OtherExpenseClaimsListItem"
		    },
		   	"AmountDisbursed": "Yes",
		   	"Status":"Amount Disbursed"      
	    };
	    
	    $.ajax({
			url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('OtherExpenseClaims')/items(" + claimID + ")",
			type: "POST",
			async: false,
			contentType: "application/json;odata=verbose",
			data: JSON.stringify(item),                    
			headers: {
					"Accept": "application/json;odata=verbose",
					"X-RequestDigest": $("#__REQUESTDIGEST").val(),
					"IF-MATCH": "*",
					"X-HTTP-Method":"MERGE",
				},                    
			success: function(data) {
   					
			},
			error: function(data) {
						console.log(data);
			}
		
		});

}


	
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
						var dialog = bootbox.dialog({
    title: 'Click on file names to download:',
    message: attachmentFiles});
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
        alert("Please enter a valid item ID");  
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
            bootbox.alert("Claim ID CCD"+ID+" deleted successfully.", function(){ 
    				location.reload();				});
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