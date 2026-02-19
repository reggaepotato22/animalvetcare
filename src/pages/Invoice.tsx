import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, DollarSign, Stethoscope, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  patientName: string;
  species: string;
  breed: string;
  ownerName: string;
  visitDate: Date;
  diagnosis: string;
  recommendation: string;
  followUpDate?: Date;
  items: InvoiceItem[];
  taxRate: number;
}

const mockInvoices: Record<string, Invoice> = {
  "1": {
    id: "1",
    patientName: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    ownerName: "Sarah Johnson",
    visitDate: new Date(),
    diagnosis: "Routine wellness examination. Overall healthy patient.",
    recommendation:
      "Continue current diet and activity. Recheck in 12 months or sooner if concerns arise.",
    followUpDate: new Date(),
    items: [
      { description: "Consultation and physical examination", quantity: 1, unitPrice: 45 },
      { description: "Core vaccination", quantity: 1, unitPrice: 25 },
    ],
    taxRate: 0,
  },
};

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = id ? mockInvoices[id] : null;

  if (!invoice) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 print:min-h-0">
        <p className="text-lg font-medium text-muted-foreground">Invoice not found.</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const taxAmount = subtotal * invoice.taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="flex justify-center print:bg-white">
      <div className="w-full max-w-3xl space-y-6 rounded-lg bg-background p-4 shadow-sm print:shadow-none print:border print:border-border print:p-0">
        <div className="flex items-center justify-between print:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print Invoice
          </Button>
        </div>

        <Card className="border-none shadow-none print:border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Visit Invoice</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Invoice ID: {invoice.id}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Animal Vet Care</p>
                <p>123 Clinic Street</p>
                <p>City, Country</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <User className="h-4 w-4" />
                  Patient & Owner
                </h3>
                <p className="font-medium">
                  {invoice.patientName} ({invoice.species} • {invoice.breed})
                </p>
                <p className="text-xs text-muted-foreground">
                  Owner: {invoice.ownerName}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Visit Details
                </h3>
                <p className="text-xs">
                  Visit date: {format(invoice.visitDate, "PPP")}
                </p>
                {invoice.followUpDate && (
                  <p className="text-xs">
                    Follow-up date: {format(invoice.followUpDate, "PPP")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                <Stethoscope className="h-4 w-4" />
                Medical Summary
              </h3>
              <p className="text-sm font-medium">Diagnosis</p>
              <p className="text-sm text-muted-foreground">{invoice.diagnosis}</p>
              <p className="mt-2 text-sm font-medium">Recommendations</p>
              <p className="text-sm text-muted-foreground">{invoice.recommendation}</p>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Summary
                </span>
                <Badge variant="outline" className="text-[10px] font-normal">
                  All fees in USD
                </Badge>
              </h3>
              <div className="overflow-hidden rounded-md border">
                <div className="grid grid-cols-[2fr_80px_100px_100px] items-center border-b bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>Item</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Unit Price</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="divide-y">
                  {invoice.items.map((item, index) => {
                    const lineTotal = item.quantity * item.unitPrice;
                    return (
                      <div
                        key={`${item.description}-${index}`}
                        className="grid grid-cols-[2fr_80px_100px_100px] items-center px-3 py-2 text-xs"
                      >
                        <span>{item.description}</span>
                        <span className="text-right">{item.quantity}</span>
                        <span className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="text-right">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs">
                <div className="flex w-full max-w-xs justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex w-full max-w-xs justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex w-full max-w-xs justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-muted-foreground">
              This document serves as both a medical visit summary and a receipt for
              services rendered.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

