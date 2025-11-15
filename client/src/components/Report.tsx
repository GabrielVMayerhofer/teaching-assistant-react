import React, { useState, useEffect } from "react";
import ClassService from "../services/ClassService";
import { ApprovalSummaryReportResponse } from "../types/Report";
import { Status } from "../types/Evaluation";

interface ClassReportProps {
  classId: string;
}

const ClassReport: React.FC<ClassReportProps> = ({ classId }) => {
  const [reportData, setReportData] = useState<ApprovalSummaryReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReportData(null);
    setError(null);
  }, [classId]);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const data = await ClassService.generateApprovalSummaryReport(classId);
      setReportData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 style={{ margin: "24px 0 12px 0", fontSize: "1.1rem" }}>Class Approval Report</h3>
      <button onClick={handleGenerateReport} disabled={loading} className="report-btn" style ={{   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",  margin: "6px"}}>
        {loading ? "Calculating..." : "Generate Report"}
      </button>

      {error && <p style={{ color: "red" }}>Erro: {error}</p>}

      {reportData && (
        <div className="report-results">
          <h4>Class Report</h4>
          <ul>
            <li><strong>Approved:</strong> {reportData.summary[Status.APPROVED]}</li>
            <li><strong>Failed:</strong> {reportData.summary[Status.REJECTED]}</li>
            <li><strong>In Progress:</strong>{" "}{reportData.summary[Status.IN_PROGRESS]}</li>
            <li><strong>Total Students:</strong>{" "}{reportData.summary.totalStudents}</li>
          </ul>

          <hr />
          <h4>Detalhes por Aluno</h4>
          <table className="evaluation-table">
            <thead>
              <tr>
                <th className="report-header">Student</th>
                <th className="report-header">CPF</th>
                <th className="report-header">Final Status</th>
              </tr>
            </thead>
            <tbody style={{ border: "1px solid #ddd" }}>
              {reportData.details.map((item) => (
                <tr key={item.student.cpf}>
                  <td className="report-cells">{item.student.name}</td>
                  <td className="report-cells">{item.student.cpf}</td>
                  <td className="report-cells">
                    {item.status === Status.APPROVED ? (
                      <span style={{ color: 'green' }}>Approved</span>
                    ) : item.status === Status.REJECTED ? (
                      <span style={{ color: 'red' }}>Rejected</span>
                    ) : (
                      <span style={{ color: '#333' }}>In Progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClassReport;
