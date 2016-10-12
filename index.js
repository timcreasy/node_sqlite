"use strict";

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/Chinook_Sqlite.sqlite');
const Table = require('cli-table');
const colors = require('colors');

db.serialize(() => {

  db.all(`SELECT FirstName || " " || LastName AS Name,
                 CustomerId, 
                 Country 
          FROM   Customer
          WHERE  Country IS NOT "USA";`,
         (err, customers) => {
            console.log(customers);
          });

  db.each(`SELECT FirstName || " " || LastName AS Name,
                 CustomerId, 
                 Country 
          FROM   Customer
          WHERE  Country IS "Brazil";`,
         (err, customer) => {
            console.log(`${customer.CustomerId}: ${customer.Name} (${customer.Country})`);
          });


   db.all(`SELECT Customer.FirstName || " " || Customer.LastName AS "Name",
                  Invoice.InvoiceId,
                  Invoice.InvoiceDate,
                  Invoice.BillingCountry
           FROM   Invoice
           JOIN   Customer ON Invoice.CustomerId == Customer.CustomerId
           WHERE  Customer.Country = "Brazil";`,
           (err, customers) => {

              const table = new Table({
                head: ['InvoiceId', 'Name', 'Date', 'Billing Country'], 
                colWidths: [13, 20, 30, 20]
              });

             customers.forEach((customer) => {
               table.push([customer.InvoiceId, customer.Name, customer.InvoiceDate, customer.BillingCountry]);
             });
              
              console.log(table.toString());
              
            });
            
  });
db.close();
