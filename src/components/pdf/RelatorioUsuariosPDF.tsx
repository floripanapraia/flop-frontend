import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Usuario } from '../../services/userService';

// --- Estilização do Documento ---
// Fontes podem ser registradas para serem usadas no PDF
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
    fontSize: 9,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E40AF', // Azul escuro
  },
  table: {
    display: "flex",
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB', // Cinza claro
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6', // Cinza bem claro
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
    margin: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: 'grey',
    fontSize: 8,
  }
});


// --- Componente do Documento ---
interface RelatorioUsuariosPDFProps {
  usuarios: Usuario[];
  titulo: string;
}

const RelatorioUsuariosPDF: React.FC<RelatorioUsuariosPDFProps> = ({ usuarios, titulo }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>

      {/* Título do Documento */}
      <Text style={styles.header}>{titulo}</Text>

      {/* Tabela de Usuários */}
      <View style={styles.table}>

        {/* Cabeçalho da Tabela */}
        <View style={styles.tableHeader} fixed>
          <View style={[styles.tableCol, { width: '5%' }]}>
            <Text style={styles.tableCell}>ID</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCell}>Nome</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>Nickname</Text>
          </View>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCell}>Email</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>Posts Bloqueados</Text>
          </View>
          <View style={[styles.tableCol, { width: '10%' }]}>
            <Text style={styles.tableCell}>Tipo</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCell}>Status</Text>
          </View>
        </View>

        {/* Corpo da Tabela */}
        {usuarios.map(usuario => (
          <View style={styles.tableRow} key={usuario.id}>
            <View style={[styles.tableCol, { width: '5%' }]}>
              <Text style={styles.tableCell}>{usuario.id}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text style={styles.tableCell}>{usuario.nome}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>@{usuario.nickname}</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCell}>{usuario.email}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text style={styles.tableCell}>{usuario.totalPostagensBloqueadas}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text style={styles.tableCell}>{Number(usuario.isAdmin) === 1 ? 'Admin' : 'User'}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>{Number(usuario.isBloqueado) === 1 ? 'Banido' : 'Ativo'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Rodapé com número da página */}
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
        `Página ${pageNumber} de ${totalPages} - Gerado em ${new Date().toLocaleDateString('pt-BR')}`
      )} fixed />

    </Page>
  </Document>
);

export default RelatorioUsuariosPDF;