import * as SQLite from 'expo-sqlite';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';

export default function index() {

    const [listaPessoas, setListaPessoas] = useState([]);
    const [id, setId] = useState();
    const [nome, setNome] = useState()
    const [idade, setIdade] = useState()

    async function abrirBanco() {
        const db = await SQLite.openDatabaseAsync('unifei');
        return db;
    }

    async function criarBanco() {
        const banco = await abrirBanco();
        const result = await banco.runAsync("CREATE TABLE IF NOT EXISTS pessoas (id TEXT PRIMARY KEY, nome TEXT NOT NULL, idade INTEGER); ")
        console.log(result.changes)
    }

    async function excluirBanco() {
        await SQLite.deleteDatabaseAsync('unifei')
    }

    async function inserirPessoas() {
        try {
            if ((nome != "")) {
                novoID = uuid.v4();
                const banco = await abrirBanco();
                const dados = await banco.runAsync("INSERT INTO pessoas (id, nome, idade) values(?, ? , ?)", [novoID, nome, parseInt(idade)])
                console.log(dados.lastInsertRowId);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function listarPessoas() {
        const banco = await abrirBanco();
        const pessoas = await banco.getAllAsync("SELECT * FROM pessoas")
        setListaPessoas(pessoas);
    }



    return (
        <View style={estilo.container}>
            <Text>Banco de Dados</Text>
            <View style={estilo.botao}>
                <Button
                    title='Excluir Banco'
                    onPress={() => excluirBanco()}
                />
            </View>
            <View style={estilo.botao}>
                <Button
                    title='Criar Banco'
                    onPress={() => criarBanco()}
                />
            </View>
            <View style={estilo.botao}>
                <Button
                    title='Inserir Dados'
                    onPress={() => inserirPessoas()}
                />
            </View>
            <View style={estilo.botao}>
                <Button
                    title='Listar Dados'
                    onPress={() => listarPessoas()}

                />
            </View>

            <TextInput
                placeholder='Nome'
                onChangeText={(text) => setNome(text)}
            />

            <TextInput
                placeholder='Idade'
                onChangeText={(text) => setIdade(text)}
            />


            {listaPessoas.map((pessoa) => {
                return (
                    <Text key={pessoa.id} >{pessoa.nome}</Text>
                )
            })}

        </View>
    )
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botao: {
        width: 200,
        padding: 10
    }
})