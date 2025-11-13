const PDFDocument = require('pdfkit');

async function generateWillPdf({ willId, user, willData, assessmentContent }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const primaryColor = '#FACC15';
      const textColor = '#1F2937';
      const lightGray = '#6B7280';

      doc.fontSize(24)
         .fillColor(primaryColor)
         .text('LAST WILL AND TESTAMENT', { align: 'center' })
         .moveDown(0.5);

      doc.fontSize(10)
         .fillColor(lightGray)
         .text(`Document ID: ${willId}`, { align: 'center' })
         .text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' })
         .moveDown(2);

      doc.fontSize(14)
         .fillColor(textColor)
         .text('Jurisdiction Information', { underline: true })
         .moveDown(0.5);

      doc.fontSize(11)
         .text(`Country: ${willData.country === 'CA' ? 'Canada' : 'United States'}`)
         .text(`Jurisdiction: ${willData.jurisdiction_full_name}`)
         .moveDown(1.5);

      doc.fontSize(14)
         .fillColor(textColor)
         .text('Legal Compliance Statement', { underline: true })
         .moveDown(0.5);

      doc.fontSize(10)
         .fillColor(textColor)
         .text(willData.compliance_statement || 'No compliance statement available.', {
           align: 'justify',
           lineGap: 4
         })
         .moveDown(2);

      if (willData.qa_data && Array.isArray(willData.qa_data) && willData.qa_data.length > 0) {
        doc.fontSize(14)
           .fillColor(textColor)
           .text('Questionnaire Responses', { underline: true })
           .moveDown(1);

        willData.qa_data.forEach((round, roundIndex) => {
          doc.fontSize(12)
             .fillColor(primaryColor)
             .text(`Round ${roundIndex + 1}`, { underline: true })
             .moveDown(0.5);

          if (round.answers && Array.isArray(round.answers)) {
            round.answers.forEach((answer, answerIndex) => {
              doc.fontSize(10)
                 .fillColor(lightGray)
                 .text(`Q${answerIndex + 1}: ${answer.question}`)
                 .fontSize(11)
                 .fillColor(textColor)
                 .text(`A: ${answer.answer}`, { indent: 20 })
                 .moveDown(0.8);
            });
          }

          doc.moveDown(1);
        });
      }

      if (assessmentContent) {
        doc.addPage()
           .fontSize(14)
           .fillColor(textColor)
           .text('Legal Assessment', { underline: true })
           .moveDown(1);

        doc.fontSize(10)
           .fillColor(textColor)
           .text(assessmentContent, {
             align: 'justify',
             lineGap: 4
           })
           .moveDown(2);
      }

      doc.addPage()
         .fontSize(12)
         .fillColor(textColor)
         .text('IMPORTANT LEGAL DISCLAIMER', { align: 'center', underline: true })
         .moveDown(1);

      const disclaimer = `This document was generated using an AI-assisted will generation tool as part of an academic project at the University of Calgary (ENTI333). This tool is provided for educational and informational purposes only.

LEGAL NOTICE:
1. This is NOT a substitute for professional legal advice.
2. This document has NOT been reviewed by a licensed attorney.
3. Laws vary by jurisdiction and change over time.
4. You should consult with a qualified estate planning attorney before executing any will.
5. This tool does not guarantee the legal validity of this document in your jurisdiction.

EXECUTION REQUIREMENTS:
To make this will legally binding, you must:
- Sign the document in the presence of the required number of witnesses
- Ensure witnesses meet the legal qualifications for your jurisdiction
- Follow all execution requirements specific to your province/state
- Consider having the will notarized where applicable

The creators of this tool assume no liability for any legal consequences arising from the use of this document.

USER INFORMATION:
Email: ${user.email || 'Not provided'}
Account Number: ${user.account_number || 'Not provided'}
Generated: ${new Date().toISOString()}`;

      doc.fontSize(9)
         .fillColor(textColor)
         .text(disclaimer, {
           align: 'justify',
           lineGap: 3
         });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateWillPdf
};
