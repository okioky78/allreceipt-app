import React from 'react';
import { Receipt } from '../constants';

interface ReceiptDocumentProps {
  data: Receipt;
  id?: string;
}

export const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({ data, id }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Pure inline styles to avoid any Tailwind/oklch issues during capture
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      backgroundColor: '#ffffff',
      padding: '60px',
      width: '850px',
      minHeight: '1200px',
      color: '#18181b',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Noto Sans KR', sans-serif",
      boxSizing: 'border-box',
    },
    titleWrapper: {
      textAlign: 'center',
      marginBottom: '50px',
      marginTop: '20px',
    },
    title: {
      fontSize: '44px',
      fontWeight: 'bold',
      letterSpacing: '0.5em',
      borderBottom: '3px solid #18181b',
      display: 'inline-block',
      paddingBottom: '5px',
      margin: '0',
    },
    middleSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '50px',
      width: '100%',
    },
    statementBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    statementText: {
      fontSize: '20px',
      fontWeight: 'bold',
      lineHeight: '1.5',
      margin: '0',
    },
    dateText: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#71717a',
      margin: '0',
    },
    companyName: {
      fontSize: '24px',
      fontWeight: '900',
      marginTop: '10px',
      letterSpacing: '-0.02em',
      margin: '0',
    },
    approvalTable: {
      borderCollapse: 'collapse',
      border: '1px solid #18181b',
      fontSize: '14px',
    },
    approvalHeader: {
      border: '1px solid #18181b',
      backgroundColor: '#fafafa',
      padding: '10px 25px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    approvalCell: {
      border: '1px solid #18181b',
      padding: '25px 15px',
      textAlign: 'center',
      fontSize: '18px',
      minWidth: '100px',
    },
    mainTable: {
      width: '100%',
      maxWidth: '730px',
      borderCollapse: 'collapse',
      border: '2px solid #18181b',
      margin: '0 auto 50px auto',
    },
    tableLabel: {
      border: '1px solid #18181b',
      backgroundColor: '#fafafa',
      padding: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100px',
      fontSize: '14px',
    },
    tableValue: {
      border: '1px solid #18181b',
      padding: '12px',
      fontWeight: '500',
      fontSize: '15px',
      width: '180px',
    },
    amountValue: {
      border: '1px solid #18181b',
      padding: '12px',
      fontWeight: 'bold',
      color: '#2563eb',
      fontSize: '20px',
      width: '180px',
    },
    receiptSection: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    receiptBox: {
      width: '100%',
      maxWidth: '730px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    receiptLabel: {
      fontSize: '24px',
      color: '#a1a1aa',
      marginBottom: '20px',
      letterSpacing: '0.1em',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    footer: {
      marginTop: '40px',
      paddingTop: '30px',
      textAlign: 'center',
      borderTop: '1px solid #f4f4f5',
    },
    footerText: {
      fontSize: '11px',
      color: '#d4d4d8',
      fontWeight: '500',
      margin: '0',
    }
  };

  return (
    <div id={id} style={styles.container}>
      {/* Top Section: Title */}
      <div style={styles.titleWrapper}>
        <h1 style={styles.title}>지 출 증 빙 품 의 서</h1>
      </div>

      {/* Middle Section: Statement and Approval */}
      <div style={styles.middleSection}>
        <div style={styles.statementBox}>
          <p style={styles.statementText}>
            위와 같이 지출 증빙 서류를 제출하오니<br />
            승인하여 주시기 바랍니다.
          </p>
          
          <div>
            <p style={styles.dateText}>
              {year}년 {month}월 {day}일
            </p>
            <p style={styles.companyName}>
              주식회사 그린섬(직인생략)
            </p>
          </div>
        </div>

        {/* Approval Box */}
        <table style={styles.approvalTable}>
          <tbody>
            <tr>
              <td rowSpan={2} style={{ ...styles.approvalHeader, width: '40px', padding: '20px 10px' }}>결<br/>재</td>
              <td style={styles.approvalHeader}>담당자</td>
              <td style={styles.approvalHeader}>승인자</td>
            </tr>
            <tr>
              <td style={styles.approvalCell}>{data.user || ''}</td>
              <td style={styles.approvalCell}>{data.approver || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Table */}
      <table style={styles.mainTable}>
        <tbody>
          <tr>
            <td style={styles.tableLabel}>사업장</td>
            <td style={styles.tableValue}>{data.business_unit}</td>
            <td style={styles.tableLabel}>사용 금액</td>
            <td style={styles.amountValue}>₩{(data.amount || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td style={styles.tableLabel}>사용 일자</td>
            <td style={styles.tableValue}>{data.date}</td>
            <td style={styles.tableLabel}>사용처(상호)</td>
            <td style={styles.tableValue}>{data.place}</td>
          </tr>
          <tr>
            <td style={styles.tableLabel}>사용 분류</td>
            <td style={styles.tableValue}>{data.payment_method}</td>
            <td rowSpan={2} style={styles.tableLabel}>사용 용도</td>
            <td rowSpan={2} style={{ ...styles.tableValue, verticalAlign: 'middle' }}>{data.usage_purpose}</td>
          </tr>
          <tr>
            <td style={styles.tableLabel}>사용자</td>
            <td style={styles.tableValue}>{data.user}</td>
          </tr>
        </tbody>
      </table>

      {/* Receipt Image */}
      <div style={styles.receiptSection}>
        {data.image_url && (
          <div style={styles.receiptBox}>
            <p style={styles.receiptLabel}>실물 영수증 증빙</p>
            <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <img 
                src={data.image_url} 
                alt="Receipt" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Smart Expense Pro v2.5 | Digital Evidence Recording System
        </p>
      </div>
    </div>
  );
};
