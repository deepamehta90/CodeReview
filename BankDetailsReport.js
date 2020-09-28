﻿var LoginUserEmail;

$(document).ready(function () {
loadTable();
$(document).on('click','#Exporttoexcel',function(e){
fnExcelReport();
});
});

function loadTable(){
debugger;
var requestUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('EmployeeData')/items?$filter=(BankName eq 'ICICI Bank' or BankName eq 'HDFC Bank' or BankName eq 'Kotak Mahindra Bank')";

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
        tableContents = '<table id="example" class="display table-bordered" style="width:100%;"><thead><tr><th scope="col">Employee Name</th><th scope="col">Employee Code</th><th scope="col">Bank Name</th><th scope="col">Account Number</th><th scope="col">IFSC</th></tr></thead><tbody>';
       // alert(objItems.length)
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
	        			            	//Employee Name
                  if(objItems[i].EmpName != null && objItems[i].EmpName != "" ){
	            		tableContent += '<td>'+objItems[i].EmpName +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	//Employee Band
                  if(objItems[i].EmpCode != null && objItems[i].EmpCode != "" ){
	            		tableContent += '<td>'+objItems[i].EmpCode +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}

                  if(objItems[i].BankName != null && objItems[i].BankName != "" ){
	            		tableContent += '<td>'+objItems[i].BankName +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
if(objItems[i].AccountNo != null && objItems[i].AccountNo != "" ){
	            		tableContent += '<td>'+objItems[i].AccountNo +'</td>';
	            	}else{
	            		tableContent += '<td></td>';
	            	}
	            	
	            	
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

function DeleteClaim(ID)
{
alert("Deleted");
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
        window.navigator.msSaveBlob(blob1, "BankDetails.xls");
      } else {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "BankDetails.xls");
        return (sa);
      }    
    }  
    else
        {
            var filename = "BankDetails";
            var a = document.createElement('a');
            var data_type = 'data:application/vnd.ms-excel';
            a.href = data_type + ', ' + encodeURIComponent(tab_text);
            a.download = filename + '.xls';
            a.click();  
        }
}