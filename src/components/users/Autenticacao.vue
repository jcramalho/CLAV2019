<template>
  <v-container grid-list-md bg fill-height>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md5>
        <v-card>
          <v-toolbar color="indigo accent-4" dark>
            <v-toolbar-title>Como proceder à autenticação?</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            Na plataforma CLAV é possível proceder à autenticação através das
            seguintes formas:
            <ul>
              <li>
                Cartão de Cidadão.
              </li>
              <li>
                Chave Móvel Digital.
              </li>
              <li>
                Email pessoal institucional e respetiva senha de acesso.
              </li>
            </ul>
            Para tal, basta escolher o método de autenticação pretendido,
            através do botão de login correspondente.
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md7>
        <v-card>
          <v-toolbar color="indigo accent-4" dark>
            <v-toolbar-title>Autenticação</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            De modo a aceder à plataforma CLAV, por favor escolha um dos
            seguintes métodos de autenticação.
          </v-card-text>
          <v-card-actions>
            <v-flex>
              Cartão de Cidadão
            </v-flex>
            <v-flex class="text-xs-right">
              <form action="https://preprod.autenticacao.gov.pt/fa/Default.aspx" method="POST">
                <input type="hidden" name='SAMLRequest' v-bind:value="createSAML()">
                <v-btn color="primary" type="submit">Login</v-btn>
              </form>
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Chave Móvel Digital
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" disabled type="submit"
                >Login</v-btn
              >
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Email pessoal institucional
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="loginEmail"
                >Login</v-btn
              >
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md12>
        <v-card>
          <v-card-actions>
            <v-flex>
              É a primeira vez que utiliza estes serviços?
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="registarUtilizador">Registar</v-btn>
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              Esqueceu a sua password?
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="recuperarPw">Recuperar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md12>
        <v-card>
          <v-card-actions>
            <v-flex>
              É um fornecedor de serviços? Registe aqui a sua chave API
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="registarApi">Registar</v-btn>
            </v-flex>
          </v-card-actions>
          <v-card-actions>
            <v-flex>
              A sua chave API expirou? Peça aqui a renovação da sua chave API
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn color="primary" type="submit" @click="renovarApi">Renovar</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const fs = require('fs');
const builder = require('xmlbuilder');
const uuidv4 = require('uuid/v4');
const SignedXml = require('xml-crypto').SignedXml
const FileKeyInfo = require('xml-crypto').FileKeyInfo

import SigningKey from '!raw-loader!./../../certificates/signing_key.pem';
import X509Certificate from '!raw-loader!./../../certificates/x509_certificate.cer';

export default {
  name: "autenticacao",
  methods: {
    registarUtilizador() {
      this.$router.push("/users/registo");
    },
    recuperarPw() {
      this.$router.push("/users/recuperacao");
    },
    loginEmail() {
      this.$router.push("/users/login");
    },
    //API
    registarApi() {
      this.$router.push("/gestao/api/registo");
    },
    renovarApi(){
      this.$router.push("/gestao/api/renovar");
    },
    buildSamlRequest(){
      var uuid = '_'+uuidv4();
      var xml = builder.begin({
          encoding: 'utf-8',
        }).ele({
          "AuthnRequest": {
            "@ID": uuid,
            "@Version": "2.0",
            "@IssueInstant": new Date().toISOString(),
            "@Destination": "https://preprod.autenticacao.gov.pt/fa/Default.aspx",
            "@ProtocolBinding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
            "@AssertionConsumerServiceURL": "https://clav-auth.di.uminho.pt/assertion",
            "@ProviderName": "CLAV",
            "@xmlns": "urn:oasis:names:tc:SAML:2.0:protocol",
            "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "@xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
            "@Consent": "urn:oasis:names:tc:SAML:2.0:consent:unspecified" 
          }
        }).ele(
          "Issuer", {
            "xmlns": "urn:oasis:names:tc:SAML:2.0:assertion"
          }, "http://clav-auth.di.uminho.pt"
        ).up().ele(
          "Extensions"
        ).ele(
          "fa:RequestedAttributes", {
            "xmlns:fa": "http://autenticacao.cartaodecidadao.pt/atributos"
          }
        ).ele(
          "fa:RequestedAttribute", {
            "Name": "http://interop.gov.pt/MDC/Cidadao/NIC", "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:uri", "isRequired":"True"
          }
        ).up().ele(
          "fa:RequestedAttribute", {
            "Name": "http://interop.gov.pt/MDC/Cidadao/NomeCompleto", "NameFormat": "urn:oasis:names:tc:SAML:2.0:attrname-format:uri", "isRequired":"True"
          }
        )
      .end();

      var sig = new SignedXml()
      sig.signingKey = SigningKey;
      sig.keyInfoProvider = new FileKeyInfo()
      sig.addReference("//*[local-name(.)='AuthnRequest']", ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/2001/10/xml-exc-c14n#"], "http://www.w3.org/2000/09/xmldsig#sha1")
      sig.computeSignature(xml,{location: { reference: "//*[local-name(.)='Issuer']", action: "after" }})

      //Metodo auxiliar pra adicionar X509, visto o keyInfoProvider nao funcionar em Typescript
      return sig.getSignedXml().replace('<X509Data/>',this.generateX509())
    },
    generateX509(){
      return '<X509Data><X509Certificate>'+this.stripPEMHeaders(X509Certificate)+'</X509Certificate></X509Data>';
    },
    stripPEMHeaders(pem) {
      const re = /-----BEGIN [0-9A-Z ]+-----([^-]*)-----END [0-9A-Z ]+-----/g;
      const pemData = re.exec(pem);
      if (pemData) {
        return pemData[1].replace(/[\r\n|\n]/g, "");
      } else {
        const stripped = pem.replace(/[\r\n|\n]/g, "");
        const base64DecodedAndBack = Buffer.from(stripped, "base64").toString("base64");
        if (stripped == base64DecodedAndBack) {
          return stripped
        } else {
          throw new Error("provided certificate or key is not PEM-encoded");
        }
      }
    },
    stripExtension(xml) {
      return xml.replace('Extensions xmlns="urn:oasis:names:tc:SAML:2.0:protocol"', "Extensions");
    },
    createSAML(){
      return btoa(this.stripExtension(this.buildSamlRequest()));
    }
  }
};
</script>
