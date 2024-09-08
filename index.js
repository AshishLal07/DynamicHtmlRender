const express = require("express");
const app = express();

// code for converting number to string format
function numberToWords(num) {
	const ones = [
		"",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
	];
	const teens = [
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen",
	];
	const tens = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety",
	];
	const thousands = ["", "thousand", "million", "billion"];

	if (num === 0) return "zero";

	let result = "";
	let i = 0;
	while (num > 0) {
		if (num % 1000 !== 0) {
			result = helper(num % 1000) + " " + thousands[i] + " " + result;
		}
		num = Math.floor(num / 1000);
		i++;
	}

	return result.trim();

	function helper(num) {
		if (num === 0) return "";
		if (num < 10) return ones[num];
		if (num < 20) return teens[num - 10];
		if (num < 100)
			return (
				tens[Math.floor(num / 10)] +
				(num % 10 !== 0 ? " " + ones[num % 10] : "")
			);
		return (
			ones[Math.floor(num / 100)] +
			" hundred" +
			(num % 100 !== 0 ? " " + helper(num % 100) : "")
		);
	}
}

//  data for testing templates
const data = {
	company: {
		companyName: "",
		companyLogo:
			"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
	},
	sellerDetails: {
		name: "Varasidihi Silk Exports",
		address: "75, 3rd Cross, Lalbagh Road, BENGALURU, KARNATAKA, 560027",
		PANNo: "AACFV3325K",
		GSTRegistrationNo: "29AACFV3325K1ZY",
	},
	billingDetails: {
		name: "Madhu B",
		address:
			"Eurofins IT Solutions India Pvt Ltd., 1st Floor, Maruti Platinum, Lakshminarayana Pura, AECS Layout, BENGALURU, KARNATAKA, 560037",
	},
	shippingDetails: {
		name: "Madhu B",
		address:
			"Eurofins IT Solutions India Pvt Ltd., 1st Floor, Maruti Platinum, Lakshminarayana Pura, AECS Layout, BENGALURU, KARNATAKA, 560037",
		placeOfSupply: "KARNATAKA",
		placeOfDelivery: "KARNATAKA",
		stateCode: "29",
	},
	invoiceDetails: {
		orderNumber: "403-3225714-7676307",
		orderDate: "28.10.2019",
		invoiceNumber: "N-761",
		invoiceDate: "28.10.2019",
		invoiceDetailsCode: "KA-310566205-1920",
	},
	items: [
		{
			itemNumber: 1,
			quantity: 1,
			description:
				"Varasidihi Silks Men's Formal Shirt (SH-05-42, Navy Blue, 42)",
			productCode: "B07KGF3KW8",
			size: "SH-05-42",
			unitPrice: "₹358.10",
			taxType: "CGST",
			taxRate: "9.0%",
			taxAmount: "₹13.45",
			totalAmount: "₹365.00",
			discount: "10%",
			shippingCharges: {
				amount: "₹30.96",
				taxType: "CGST",
				taxRate: "9.0%",
				taxAmount: "₹0.77",
			},
		},
		{
			itemNumber: 2,
			quantity: 1,
			description:
				"Varasidihi Silks Men's Formal Shirt (SH-05-40, Navy Blue, 40)",
			productCode: "B07KGCS2X7",
			size: "SH-05-40",
			unitPrice: "₹358.10",
			taxType: "IGST",
			taxRate: "18.0%",
			taxAmount: "₹13.45",
			totalAmount: "₹365.00",
			discount: "10%",
			shippingCharges: {
				amount: "₹30.96",
				taxType: "IGST",
				taxRate: "18.0%",
				taxAmount: "₹0.77",
			},
		},
	],

	totals: {
		totalAmountWithoutTax: "₹718.00",
		totalTaxAmount: "₹28.44",
		totalAmountWithTax: "₹1,195.00",
	},
	amountInWords: "One Thousand One Hundred And Ninety-five only",
	authorizedSignatory: "For Varasidihi Silk Exports",
	authorizedSignatoryUrl: "",
};

// function used to generate pdf for download setup pupetter for pdf usage
// const AmazonInvoiceGenerationPdf = async (content) => {
// 	try {
// 		const browser = await puppeteer.launch({
// 			headless: true,
// 			args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 		});
// 		const page = await browser?.newPage();

// 		await page.setContent(content, {waitUntil: "networkidle0"});
// 		const pdfBuffer = await page.pdf({format: "A4"});

// 		await browser.close();

// 		return pdfBuffer;
// 	} catch (error) {
// 		throw new Error(error);
// 	}
// };

// for rendering invoice of HTML format for sending you can use in email also by calling function by passing data
const AmazonInvoice = (data) => {
	let totalTax = 0.0;
	let totalAmount = 0.0;
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<style>
			body {
			  font-family: Arial, sans-serif;
			  margin: 0;
			  padding: 0;
			  background-color: #f4f4f4;
			}
			.invoice-container {
			  background-color: #fff;
			  max-width: 800px;
			  margin: 20px auto;
			  padding: 20px;
			  border: 1px solid #e0e0e0;
			  border-radius: 5px;
			}
			.header {
			  display: flex;
			  justify-content: space-between;
			  align-items: center;
			}
			.header img {
			  width: 150px;
			}
			.invoice-header {
			  margin-top: 20px;
			}
			.invoice-details, .buyer-seller {
			  width: 100%;
			  border-collapse: collapse;
			  margin-top: 10px;
			}
			.buyer-seller th, .buyer-seller td {
			  padding: 5px;
			  border: 1px solid #e0e0e0;
			}
			.buyer-seller th {
			  text-align: left;
			  font-weight: bold;
			}
			.items {
			  width: 100%;
			  margin-top: 20px;
			  border-collapse: collapse;
			}
			.items th, .items td {
			  padding: 10px;
			  border: 1px solid #e0e0e0;
			  text-align: left;
			}
			.items th {
			  background-color: #f9f9f9;
			}
			.total {
			  text-align: right;
			  margin-top: 20px;
			  font-weight: bold;
			}
			.footer {
			  text-align: center;
			  margin-top: 20px;
			  font-size: 12px;
			  color: #888;
			}
		</style>
		<title>Invoice Template</title>
	</head>
	<body>
		<div class="invoice-container">
			<!-- Header Section -->
			<div class="header">
				<img
					src=${data.company.companyLogo} 
					alt=${data.company.companyName}
				/>
				<div>
					<h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
					<p><strong>Original for Recipient</strong></p>
				</div>
			</div>

			<!-- Buyer and Seller Info -->
			<table class="buyer-seller">
				<tr>
					<th>Sold By :</th>
					<td>
						${(data?.sellerDetails?.name, data?.sellerDetails?.address)}
					</td>
					<th>Billing Address :</th>
					<td>
                        ${(data?.billingDetails?.name, data?.billingDetails?.address)}
					</td>
				</tr>
				<tr>
					<th>PAN No:</th>
					   <td> ${data?.sellerDetails?.PANNo} </td>
					<th>Shipping Address :</th>
					<td>
					 ${(data?.shippingDetails?.name, data?.shippingDetails?.address)}
					</td>
				</tr>
				<tr>
					<th>GST Registration No:</th>
					<td>${data?.sellerDetails?.GSTRegistrationNo}</td>
					<th>State/UT Code:</th>
					<td>${data?.shippingDetails?.stateCode}</td>
				</tr>
			</table>

			<!-- Invoice Details -->
			<div class="invoice-header">
				<p><strong>Order Number:</strong> ${data?.invoiceDetails?.orderNumber}</p>
				<p><strong>Order Date:</strong> ${data?.invoiceDetails?.orderDate}</p>
				<p><strong>Invoice Number:</strong> ${data?.invoiceDetails?.invoiceNumber}</p>
				<p><strong>Invoice Details:</strong> ${data?.invoiceDetails?.invoiceDate}</p>
			</div>

			<!-- Items Table -->
			<table class="items">
				<thead>
					<tr>
						<th>Sl. No</th>
						<th>Description</th>
						<th>Unit Price</th>
                        <th>Qty</th>
						<th>Net Amount</th>
						<th>Tax Rate</th>
						<th>Tax Type</th>
						<th>Tax Amount</th>
						<th>Total Amount</th>
					</tr>
				</thead>
                <tbody>
                ${data.items.map((product) => {
									//  calculation are made for all data rendering
									const unitPrice = parseFloat(
										product.unitPrice.replace(/[₹,]/g, "")
									);
									const discount =
										parseFloat(product.discount.replace(/[%,]/g, "")) / 100;

									const shippingCharge = parseFloat(
										product?.shippingCharges.amount.replace(/[₹,]/g, "")
									);
									const taxRate =
										parseFloat(product.taxRate.replace(/[%,]/g, "")) / 100;

									const netAmount = parseFloat(
										(
											unitPrice * product.quantity -
											unitPrice * discount
										).toFixed(2)
									);

									const taxAmount = parseFloat(
										(unitPrice * taxRate).toFixed(2)
									);
									const shippingTaxAmount = parseFloat(
										(shippingCharge * taxRate).toFixed(2)
									);

									if (product.taxType === "CGST") {
										totalTax = totalTax + 2 * taxAmount + 2 * taxAmount;
									} else {
										totalTax = taxAmount + shippingTaxAmount;
									}

									totalAmount += netAmount;

									return `
                                    <tr>
						<td>${product.itemNumber}</td>
						<td>
							${product.description}
						</td>
						<td>${product.unitPrice}</td>
						<td>${product.quantity}</td>
						<td>₹${netAmount}</td>
						<td>${product.taxRate}</td>
                        <td>${product.taxType}</td>
						<td>₹${taxAmount}</td>
						<td>₹${(netAmount + taxAmount).toFixed(2)}</td>
					</tr>
                    ${
											product.taxType === "CGST"
												? `<tr>
                        <td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>${product.taxRate}</td>
						<td>SGST</td>
						<td>₹${taxAmount}</td>
						<td></td>
					</tr>`
												: ""
										}
					<tr>
						<td></td>
						<td>Shipping Charges</td>
						<td>${product.shippingCharges.amount}</td>
                        <td></td>
						<td>${product.shippingCharges.amount}</td>
						<td>${product.taxRate}</td>
						<td>${product.taxType}</td>
						<td>₹${shippingTaxAmount}</td>
						<td>₹${(shippingCharge + shippingTaxAmount).toFixed(2)}</td>
					</tr>
                    
                      ${
												product.taxType === "CGST"
													? `<tr>
                        <td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>${product.taxRate}</td>
						<td>SGST</td>
						<td>₹${shippingTaxAmount}</td>
						<td></td>
					</tr>`
													: ""
											}
                    
                    `;
								})}

                    <tr>
                        <td>Total:</td>
                        <td colspan="6"></td>
						<td>₹${totalTax.toFixed(2)}</td>
						<td>₹${totalAmount.toFixed(2)}</td>
                    </tr>
                </tbody>
			
			</table>

			<!-- Total and Footer -->
			<div class="total">
				<p>
					<strong>Amount in Words:</strong> ${numberToWords(totalAmount.toFixed(0))}
				</p>
			</div>

			<div class="footer">
				<p>For Varasiddhi Silk Exports</p>
				<p>Authorized Signatory</p>
                ${
									data.authorizedSignatoryUrl
										? `<img
					src=${data.authorizedSignatoryUrl} 
					alt=${data.authorizedSignatory}
				/>`
										: ""
								}
				<p>Whether tax is payable under reverse charge - No</p>
			</div>
		</div>
	</body>
</html>
`;
};

app.get("/", async (req, res) => {
	const htmlContent = AmazonInvoice(data);
	res.send(htmlContent);
});
// you can test this by node index.js to check for data rendering
app.listen(3000, () => {
	console.log("Server started on port 3000");
});
