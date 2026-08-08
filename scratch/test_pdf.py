import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fpdf import FPDF

def clean_text_for_pdf(text: str) -> str:
    if not text:
        return ""
    replacements = {
        "\u2019": "'",
        "\u2018": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2014": "-",
        "\u2013": "-",
        "\u2022": "-",
        "\u2026": "...",
    }
    for orig, repl in replacements.items():
        text = text.replace(orig, repl)
    return text.encode("latin-1", "replace").decode("latin-1")

class PDFReport(FPDF):
    def __init__(self, doc_title: str):
        super().__init__()
        self.doc_title = doc_title

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(128, 128, 128)
            self.cell(0, 6, clean_text_for_pdf(f"{self.doc_title} - Architectural Specification"), border=0, new_x="RIGHT", new_y="TOP", align="L")
            self.cell(0, 6, clean_text_for_pdf("AI Software Architect"), border=0, new_x="LMARGIN", new_y="NEXT", align="R")
            self.set_draw_color(200, 200, 200)
            self.line(10, 15, 200, 15)
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, clean_text_for_pdf(f"Page {self.page_no()}/{{nb}}"), align="C")

def test_pdf():
    pdf = PDFReport("Hospital Management System")
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 20)
    pdf.cell(0, 10, "Test PDF Document", new_x="LMARGIN", new_y="NEXT")
    output = bytes(pdf.output())
    print(f"Generated PDF bytes size: {len(output)}")
    assert len(output) > 100
    print("PDF generation success!")

if __name__ == "__main__":
    test_pdf()
