import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { IBusiness, IClient, IInvoice, IInvoiceItem, IRateAmounts, IRateValues } from "@/app/types";

type InvoicePdfDocumentProps = {
    invoice: IInvoice;
    business: IBusiness;
    client: IClient;
    items: IInvoiceItem[];
    rateAmounts?: IRateAmounts;
    rateValues: IRateValues;
};

const styles = StyleSheet.create({
    page: {
        padding: 36,
        backgroundColor: "#ffffff",
        color: "#18181b",
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 24,
        marginBottom: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        color: "#10b981",
        marginBottom: 8,
    },
    muted: {
        color: "#71717a",
    },
    sectionTitle: {
        fontSize: 9,
        color: "#71717a",
        textTransform: "uppercase",
        marginBottom: 6,
    },
    logo: {
        width: 54,
        height: 54,
        objectFit: "contain",
        marginBottom: 8,
        alignSelf: "flex-end",
    },
    companyName: {
        fontSize: 14,
        fontWeight: 700,
        textAlign: "right",
        marginBottom: 4,
    },
    rightText: {
        textAlign: "right",
    },
    metaGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e4e4e7",
        paddingVertical: 12,
        marginBottom: 24,
    },
    partyGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 24,
        marginBottom: 28,
    },
    partyBox: {
        flex: 1,
        padding: 14,
        borderWidth: 1,
        borderColor: "#e4e4e7",
        borderRadius: 6,
    },
    partyName: {
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 6,
    },
    table: {
        borderWidth: 1,
        borderColor: "#d4d4d8",
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#10b981",
        color: "#052e16",
        fontWeight: 700,
    },
    cell: {
        padding: 8,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#d4d4d8",
    },
    partCell: {
        width: "18%",
    },
    descriptionCell: {
        width: "38%",
    },
    numericCell: {
        width: "14.67%",
        textAlign: "right",
    },
    lastCell: {
        borderRightWidth: 0,
    },
    totals: {
        width: 220,
        alignSelf: "flex-end",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: "#e4e4e7",
    },
    grandTotal: {
        marginTop: 6,
        paddingTop: 8,
        fontSize: 13,
        fontWeight: 700,
        color: "#047857",
    },
});

const formatMoney = (amount?: number | string) =>
    new Intl.NumberFormat("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(amount ?? 0));

const formatDate = (date?: string) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

const getTotalAmount = (invoice: IInvoice, rateAmounts?: IRateAmounts) => {
    const fallback =
        Number(rateAmounts?.total ?? invoice.subtotal ?? 0) +
        Number(rateAmounts?.nhilAmount ?? invoice.nhilAmount ?? 0) +
        Number(rateAmounts?.getfundAmount ?? invoice.getfundAmount ?? 0) +
        Number(rateAmounts?.covidAmount ?? invoice.covidAmount ?? 0) +
        Number(rateAmounts?.vatAmount ?? invoice.vatAmount ?? 0);

    return Number(invoice.totalAmount ?? fallback);
};

export const InvoicePdfDocument = ({
    invoice,
    business,
    client,
    items,
    rateAmounts,
    rateValues,
}: InvoicePdfDocumentProps) => (
    <Document title={`Invoice ${invoice.invoiceNumber}`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>INVOICE</Text>
                    <Text>
                        <Text style={styles.muted}>Invoice Number: </Text>
                        {invoice.invoiceNumber}
                    </Text>
                    <Text>
                        <Text style={styles.muted}>Status: </Text>
                        {invoice.status}
                    </Text>
                </View>

                <View>
                    {business.logoUrl ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image src={business.logoUrl} style={styles.logo} />
                    ) : null}
                    <Text style={styles.companyName}>{business.name}</Text>
                    <Text style={styles.rightText}>{business.email}</Text>
                    <Text style={styles.rightText}>{business.phone}</Text>
                    <Text style={styles.rightText}>{business.address}</Text>
                    <Text style={styles.rightText}>
                        {[business.city, business.country].filter(Boolean).join(", ")}
                    </Text>
                </View>
            </View>

            <View style={styles.metaGrid}>
                <View>
                    <Text style={styles.sectionTitle}>Issue Date</Text>
                    <Text>{formatDate(invoice.issueDate)}</Text>
                </View>
                <View>
                    <Text style={styles.sectionTitle}>Due Date</Text>
                    <Text>{formatDate(invoice.dueDate)}</Text>
                </View>
                <View>
                    <Text style={styles.sectionTitle}>Currency</Text>
                    <Text>{invoice.currency}</Text>
                </View>
            </View>

            <View style={styles.partyGrid}>
                <View style={styles.partyBox}>
                    <Text style={styles.sectionTitle}>Bill To</Text>
                    <Text style={styles.partyName}>{client.name}</Text>
                    <Text>{client.email}</Text>
                    <Text>{client.phone}</Text>
                    <Text>{client.address}</Text>
                    <Text>{[client.city, client.country].filter(Boolean).join(", ")}</Text>
                </View>

                <View style={styles.partyBox}>
                    <Text style={styles.sectionTitle}>From</Text>
                    <Text style={styles.partyName}>{business.name}</Text>
                    <Text>{business.email}</Text>
                    <Text>{business.phone}</Text>
                    <Text>{business.address}</Text>
                    <Text>{[business.city, business.country].filter(Boolean).join(", ")}</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={[styles.cell, styles.partCell]}>Part No.</Text>
                    <Text style={[styles.cell, styles.descriptionCell]}>Description</Text>
                    <Text style={[styles.cell, styles.numericCell]}>Unit Price</Text>
                    <Text style={[styles.cell, styles.numericCell]}>Qty</Text>
                    <Text style={[styles.cell, styles.numericCell, styles.lastCell]}>Amount</Text>
                </View>

                {items.map((item, index) => (
                    <View key={`${item.partNumber}-${index}`} style={styles.tableRow}>
                        <Text style={[styles.cell, styles.partCell]}>{item.partNumber}</Text>
                        <Text style={[styles.cell, styles.descriptionCell]}>{item.description}</Text>
                        <Text style={[styles.cell, styles.numericCell]}>{formatMoney(item.unitPrice)}</Text>
                        <Text style={[styles.cell, styles.numericCell]}>{item.quantity}</Text>
                        <Text style={[styles.cell, styles.numericCell, styles.lastCell]}>
                            {formatMoney(item.amount)}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.totals}>
                <View style={styles.totalRow}>
                    <Text>Subtotal</Text>
                    <Text>{formatMoney(rateAmounts?.total ?? invoice.subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>NHIL {rateValues.nhil ?? invoice.nhil}%</Text>
                    <Text>{formatMoney(rateAmounts?.nhilAmount ?? invoice.nhilAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>GETFUND {rateValues.getfund ?? invoice.getfund}%</Text>
                    <Text>{formatMoney(rateAmounts?.getfundAmount ?? invoice.getfundAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>COVID {rateValues.covid ?? invoice.covid}%</Text>
                    <Text>{formatMoney(rateAmounts?.covidAmount ?? invoice.covidAmount)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>VAT {rateValues.vat ?? invoice.vat}%</Text>
                    <Text>{formatMoney(rateAmounts?.vatAmount ?? invoice.vatAmount)}</Text>
                </View>
                <View style={[styles.totalRow, styles.grandTotal]}>
                    <Text>Total</Text>
                    <Text>{formatMoney(getTotalAmount(invoice, rateAmounts))}</Text>
                </View>
            </View>
        </Page>
    </Document>
);
