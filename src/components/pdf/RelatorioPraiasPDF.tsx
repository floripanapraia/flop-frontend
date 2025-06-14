import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { PraiaDTO } from '../../services/beachService';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    paddingTop: 35,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#0284C7', // Azul do céu
  },
  table: {
    display: "flex",
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#F9FAFB', // Cinza muito claro
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 50,
    right: 50,
    textAlign: 'center',
    color: '#9CA3AF', // Cinza
    fontSize: 8,
  }
});

// Props do componente
interface RelatorioPraiasPDFProps {
  praias: PraiaDTO[];
}

// Componente que define a estrutura do PDF
const RelatorioPraiasPDF: React.FC<RelatorioPraiasPDFProps> = ({ praias }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Título */}
      <Text style={styles.header}>Relatório de Praias Cadastradas</Text>

      {/* Tabela de Praias */}
      <View style={styles.table}>

        {/* Cabeçalho da Tabela */}
        <View style={styles.tableHeader} fixed>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>ID</Text>
          </View>
          <View style={[styles.tableCol, { width: '60%' }]}>
            <Text style={styles.tableCell}>Nome da Praia</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>Avaliações Hoje</Text>
          </View>
        </View>

        {/* Corpo da Tabela */}
        {praias.map(praia => (
          <View style={styles.tableRow} key={praia.idPraia}>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>{praia.idPraia}</Text>
            </View>
            <View style={[styles.tableCol, { width: '60%' }]}>
              <Text style={styles.tableCell}>{praia.nomePraia}</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCell}>{praia.totalAvaliacoesDoDia || 0}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Rodapé */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Página ${pageNumber} de ${totalPages} - Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`
      )} fixed />

    </Page>
  </Document>
);

export default RelatorioPraiasPDF;