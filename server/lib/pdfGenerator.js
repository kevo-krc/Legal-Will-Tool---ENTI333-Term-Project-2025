const PDFDocument = require('pdfkit');

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function extractAnswers(qaData) {
  const allAnswers = {};
  
  if (!qaData || !Array.isArray(qaData)) return allAnswers;
  
  qaData.forEach(round => {
    if (round.answers) {
      Object.assign(allAnswers, round.answers);
    }
  });
  
  return allAnswers;
}

function getPersonName(personData) {
  if (!personData) return '';
  if (typeof personData === 'string') return personData;
  if (typeof personData === 'object' && personData.name) return personData.name;
  return '';
}

function formatPersonForPDF(personData) {
  if (!personData || typeof personData === 'string') return personData || '';
  
  const parts = [];
  if (personData.name) parts.push(personData.name);
  if (personData.relationship) parts.push(`(${personData.relationship})`);
  if (personData.age) parts.push(`age ${personData.age}`);
  if (personData.address) parts.push(`residing at ${personData.address}`);
  
  return parts.join(', ');
}

async function generateWillPDF(willData, userProfile) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      const answers = extractAnswers(willData.qa_data);
      const userName = userProfile?.full_name || 'Unknown';
      const jurisdiction = willData.jurisdiction_full_name || willData.jurisdiction;
      const country = willData.country === 'CA' ? 'Canada' : 'United States';
      
      // Header
      doc.fontSize(20).font('Helvetica-Bold')
         .text('LAST WILL AND TESTAMENT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica')
         .text(`of ${userName}`, { align: 'center' });
      doc.moveDown(2);
      
      // Introduction
      doc.fontSize(11).font('Helvetica')
         .text(`I, ${userName}, residing in ${jurisdiction}, ${country}, being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all former Wills and Codicils made by me.`, {
           align: 'justify'
         });
      doc.moveDown(1.5);
      
      // Article 1 - Marital Status and Family
      doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 1: DECLARATIONS');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      
      if (answers.marital_status) {
        doc.text(`1.1 Marital Status: I am ${answers.marital_status.toLowerCase()}.`);
      }
      
      if (answers.spouse_name) {
        doc.text(`1.2 Spouse: My spouse is ${answers.spouse_name}.`);
      }
      
      if (answers.children_details) {
        doc.text(`1.3 Children: ${answers.children_details}`);
      }
      doc.moveDown(1.5);
      
      // Article 2 - Executor
      doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 2: APPOINTMENT OF PERSONAL REPRESENTATIVE (EXECUTOR)');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      
      if (answers.executor_details) {
        const executorName = getPersonName(answers.executor_details);
        doc.text(`2.1 I appoint ${executorName} as my Personal Representative (Executor) to administer my estate.`);
      }
      
      if (answers.executor_compensation) {
        doc.text(`2.2 Compensation: ${answers.executor_compensation}`);
      }
      
      if (answers.alternate_executor) {
        const alternateExecutorName = getPersonName(answers.alternate_executor);
        doc.text(`2.3 Alternate Representative: If my primary Personal Representative is unable or unwilling to serve, I appoint ${alternateExecutorName} as alternate Personal Representative.`);
      }
      
      doc.text(`2.4 Powers: I grant my Personal Representative full power and authority to administer my estate, including but not limited to: selling property, paying debts and taxes, distributing assets, and taking all actions necessary for proper estate administration.`);
      doc.moveDown(1.5);
      
      // Article 3 - Guardian for Minors
      if (answers.guardian_for_minors && answers.guardian_for_minors.toLowerCase() !== 'n/a' && answers.guardian_for_minors.toLowerCase() !== 'none') {
        doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 3: GUARDIAN FOR MINOR CHILDREN');
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`3.1 If I have any children who are minors at the time of my death, I appoint ${answers.guardian_for_minors} as guardian of the person and property of my minor children.`);
        doc.moveDown(1.5);
      }
      
      // Article 4 - Debts and Expenses
      doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 4: PAYMENT OF DEBTS AND EXPENSES');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`4.1 I direct my Personal Representative to pay all my just debts, funeral expenses, and costs of administration from my estate assets before distribution to beneficiaries.`);
      
      if (answers.debts_liabilities) {
        doc.text(`4.2 Known Liabilities: ${answers.debts_liabilities}`);
      }
      doc.moveDown(1.5);
      
      // Article 5 - Specific Bequests
      if (answers.specific_bequests && answers.specific_bequests.trim() !== '' && answers.specific_bequests.toLowerCase() !== 'none' && answers.specific_bequests.toLowerCase() !== 'n/a') {
        doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 5: SPECIFIC BEQUESTS');
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        doc.text(`5.1 I make the following specific gifts:`);
        doc.moveDown(0.3);
        doc.text(answers.specific_bequests, { indent: 20 });
        doc.moveDown(1.5);
      }
      
      // Article 6 - Distribution of Residue
      doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 6: DISTRIBUTION OF RESIDUE OF ESTATE');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`6.1 After payment of debts, expenses, and specific bequests, I direct that the remainder (residue) of my estate be distributed as follows:`);
      doc.moveDown(0.3);
      
      if (answers.beneficiary_distribution) {
        doc.text(answers.beneficiary_distribution, { indent: 20 });
      }
      
      if (answers.contingent_beneficiaries) {
        doc.moveDown(0.5);
        doc.text(`6.2 Contingent Beneficiaries: ${answers.contingent_beneficiaries}`);
      }
      doc.moveDown(1.5);
      
      // Article 7 - Additional Provisions
      if (answers.digital_assets || answers.funeral_preferences) {
        doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 7: ADDITIONAL PROVISIONS');
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica');
        
        if (answers.digital_assets && answers.digital_assets.toLowerCase() !== 'none' && answers.digital_assets.toLowerCase() !== 'n/a') {
          doc.text(`7.1 Digital Assets: ${answers.digital_assets}`);
        }
        
        if (answers.funeral_preferences && answers.funeral_preferences.toLowerCase() !== 'no preference' && answers.funeral_preferences.toLowerCase() !== 'none') {
          doc.text(`7.2 Funeral Preferences: ${answers.funeral_preferences}`);
        }
        doc.moveDown(1.5);
      }
      
      // Signature Section
      doc.fontSize(12).font('Helvetica-Bold').text('IN WITNESS WHEREOF');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`I have hereunto set my hand this ______ day of ____________, 20____.`, {
        align: 'justify'
      });
      doc.moveDown(2);
      
      doc.text('_'.repeat(50));
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').text(userName, { align: 'left' });
      doc.font('Helvetica').text('(Signature of Testator)');
      doc.moveDown(2);
      
      // Witness Section
      doc.fontSize(12).font('Helvetica-Bold').text('WITNESSES');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`The foregoing instrument was signed, published, and declared by ${userName} as their Last Will and Testament, in our presence, and we, at their request and in their presence and in the presence of each other, have hereunto subscribed our names as witnesses.`);
      doc.moveDown(1.5);
      
      // First Witness
      doc.fontSize(11).font('Helvetica-Bold').text('Witness #1:');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text('Name: __________________________________________');
      doc.moveDown(0.5);
      doc.text('Signature: __________________________________________');
      doc.moveDown(0.5);
      doc.text('Address: __________________________________________');
      doc.moveDown(0.3);
      doc.text('         __________________________________________');
      doc.moveDown(1);
      
      // Second Witness
      doc.fontSize(11).font('Helvetica-Bold').text('Witness #2:');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text('Name: __________________________________________');
      doc.moveDown(0.5);
      doc.text('Signature: __________________________________________');
      doc.moveDown(0.5);
      doc.text('Address: __________________________________________');
      doc.moveDown(0.3);
      doc.text('         __________________________________________');
      doc.moveDown(2);
      
      // Footer disclaimer
      doc.fontSize(8).font('Helvetica-Oblique')
         .text('This document was generated by an AI-assisted legal will tool for academic purposes. This tool does not provide legal advice. You should consult with a licensed attorney in your jurisdiction before executing this will.', {
           align: 'center'
         });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function generateAssessmentPDF(willData, userProfile) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 }
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      const answers = extractAnswers(willData.qa_data);
      const userName = userProfile?.full_name || 'Unknown';
      const jurisdiction = willData.jurisdiction_full_name || willData.jurisdiction;
      const country = willData.country === 'CA' ? 'Canada' : 'United States';
      
      // Header
      doc.fontSize(20).font('Helvetica-Bold')
         .text('LEGAL ASSESSMENT DOCUMENT', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica')
         .text(`Will for: ${userName}`, { align: 'center' });
      doc.moveDown(0.3);
      doc.text(`Jurisdiction: ${jurisdiction}, ${country}`, { align: 'center' });
      doc.moveDown(0.3);
      doc.text(`Generated: ${formatDate(new Date())}`, { align: 'center' });
      doc.moveDown(2);
      
      // Important Notice
      doc.fontSize(11).font('Helvetica-Bold')
         .fillColor('red')
         .text('IMPORTANT LEGAL NOTICE', { align: 'center' });
      doc.fillColor('black')
         .font('Helvetica')
         .moveDown(0.5);
      
      doc.fontSize(10).text('This assessment was generated by an AI-assisted tool for academic purposes. This tool does NOT constitute legal advice and does NOT create an attorney-client relationship. You should consult with a licensed attorney in your jurisdiction before executing any legal documents.', {
        align: 'justify'
      });
      doc.moveDown(1.5);
      
      // Compliance Statement
      if (willData.compliance_statement) {
        doc.fontSize(12).font('Helvetica-Bold')
           .text('Legal Requirements for ' + jurisdiction);
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica')
           .text(willData.compliance_statement, { align: 'justify' });
        doc.moveDown(1.5);
      }
      
      // Assessment Content
      if (willData.assessment_content) {
        doc.fontSize(12).font('Helvetica-Bold')
           .text('AI-Generated Assessment & Next Steps');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica')
           .text(willData.assessment_content, { align: 'justify' });
        doc.moveDown(1.5);
      }
      
      // Summary of Responses
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold')
         .text('Summary of Your Responses', { align: 'center' });
      doc.moveDown(1);
      
      if (willData.qa_data && Array.isArray(willData.qa_data)) {
        willData.qa_data.forEach((round, roundIdx) => {
          doc.fontSize(12).font('Helvetica-Bold')
             .text(`Round ${round.round}`);
          doc.moveDown(0.5);
          
          if (round.questions && Array.isArray(round.questions)) {
            round.questions.forEach((q, qIdx) => {
              doc.fontSize(10).font('Helvetica-Bold')
                 .text(`Q${qIdx + 1}: ${q.question}`);
              doc.moveDown(0.2);
              
              const answer = round.answers[q.id];
              const answerText = Array.isArray(answer) 
                ? answer.join(', ') 
                : (answer || 'Not answered');
              
              doc.fontSize(10).font('Helvetica')
                 .text(`A: ${answerText}`, { indent: 20 });
              doc.moveDown(0.8);
            });
          }
          doc.moveDown(1);
        });
      }
      
      // Footer
      doc.fontSize(8).font('Helvetica-Oblique')
         .text('Generated by Legal Will Generation Tool - University of Calgary ENTI333 Academic Project', {
           align: 'center'
         });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  generateWillPDF,
  generateAssessmentPDF
};
