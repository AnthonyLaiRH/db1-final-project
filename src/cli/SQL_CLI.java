package cli;

import util.DBTablePrinter;

import java.io.BufferedReader;
import java.io.Console;
import java.io.IOException;
import java.io.InputStreamReader;

import java.sql.* ;  // for standard JDBC programs
import java.math.* ; // for BigDecimal and BigInteger support
import java.util.logging.Level;
import java.util.logging.Logger;

public class SQL_CLI {

    BufferedReader br;
    Console console;
    private boolean active;

    private Connection connection;
    private String url;
    private String user;
    private String password;


    public SQL_CLI() {
       this.br = new BufferedReader(new InputStreamReader(System.in));
       this.console = System.console();
       this.active = true;
       //this.url = "jdbc:postgresql://localhost:5432/dbproject";
       //this.user = "anthony";
       //this.password = "password";

       System.out.println("\n\n\n>>>>>>>>>>>>>>   Property Rental SQL Command Line Interface   <<<<<<<<<<<<<<\n\n");
    }

    public boolean isActive() {
        return active;
    }

    public void run(){
        getDBInfo();

        System.out.println("\n\nType 'h' or 'help' for help and list of commands. ");
        while (isActive()){
            readCommand();
        }
        dispose();
    }

    private void dispose(){
        try{
            this.connection.close();
        } catch (Exception e){

        } finally {
            System.out.println("DISCONNECTED");
        }
    }

    private void getDBInfo(){
        boolean completed = false;
        do {
            String url = "", user = "", password = "";
            try {
                System.out.print("\nEnter the name of the database to connect to: ");
                //String url = "jdbc:postgresql://localhost:5432/" + this.console.readLine().trim();
                url = "jdbc:postgresql://localhost:5432/" + this.br.readLine().trim();
                System.out.print("Enter user name: ");
                user = this.br.readLine().trim();
                //String user = this.br.readLine().trim();
                System.out.print("Enter password: ");
                //char[] password = this.console.readPassword();
                password = this.br.readLine().trim();
            }catch (IOException e){
                e.printStackTrace();
            }

            try {
                //this.connection = DriverManager.getConnection(url, user, String.copyValueOf(password));
                this.connection = DriverManager.getConnection(url, user, password);

                completed = true;

                this.url = url;
                this.user = user;
                //this.password = String.copyValueOf(password);
                this.password = password;

                System.out.println(password);

            } catch (SQLException e) {
                try {
                    System.out.println("\n >> Connection failed. ");
                    //e.printStackTrace();
                    System.out.print(" >> Retry? (Y/N) ");
                    String retry = this.br.readLine().trim().toLowerCase();
                    if (retry.equals("n")) {
                        completed = true;
                        this.active = false;
                    }
                }catch (IOException ioe){
                    ioe.printStackTrace();
                }
                //e.printStackTrace();
            }
        }while (!completed);
    }
    public void readCommand (){
        try {
            System.out.print("" + this.user + "# ");
            String cmd = this.br.readLine().trim().toLowerCase();

            compute(cmd);
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    public void compute(String cmd){
        switch (cmd){
            case "help":
            case "h":
                displayHelp();
                break;

            case "sql":
                fullSQL();
                break;

            case "show":
                showTable();
                break;

            case "select":
                //select();
                System.out.println(" >> Select ");
                break;
            case "update":

            case "exit":
                this.active = false;
                break;
        }
    }

    public void displayHelp(){
        System.out.println("\nEnter one of the following commands at follow the prompt" +
                "\n - sql " +
                "\n - select " +
                "\n - update " +
                "\n - delete or drop" +
                "\n");
    }

    public void showTable(){
        boolean completed = false;

        System.out.println("\nEnter the name of the table to display" +
                "\ntype \\q  to quit out of Show Table mode");

        do{
            try {
                System.out.print("\n > ");
                String tableName = this.br.readLine().trim().toLowerCase();

                if (tableName.equals("\\q")) {
                    completed = true;
                    System.out.println("\nExiting Show Table mode.");
                }else {
                    DBTablePrinter.printTable(this.connection, tableName);
                }
            }catch (IOException e){
                e.printStackTrace();
            }
        }while(!completed);
    }

    public void fullSQL(){
        boolean completed = false;
        boolean toQuery = true;
        StringBuilder query = new StringBuilder();

        System.out.println("\nEnter your SQL Query in full and end in a ; " +
                "\ntype \\q  to quit out of SQL mode\n" );
        do{
            System.out.print(" > ");
            String line;
            try {
                line = this.br.readLine().trim().toLowerCase();
                if (line.substring(line.length()-1).equals(";")) {
                    completed = true;
                }else if (line.equals("\\q")){
                    completed = true;
                    toQuery = false;
                    System.out.println("\nExiting SQL mode.");
                }
                query.append(line);
                query.append(" ");
            }catch (IOException e) {
                e.printStackTrace();
            }
        }while(!completed);


        if (toQuery) sendQuery(query.toString().trim());
    }

    public boolean sendQuery(String query){
        ResultSet rs;

        try{
            Statement st = this.connection.createStatement();
            //System.out.println(query);
            rs = st.executeQuery(query);
        }catch(SQLException e){
            if (e.getSQLState().equals("02000")){
                return true;
            }else {
                //e.printStackTrace();
                System.out.println("SQL STATE: " + e.getSQLState());
                System.out.println("MSG: " + e.getMessage());
                return false;
            }
        }

        DBTablePrinter.printResultSet(rs);
        return true;
    }



    public static void main(String[] args){
        SQL_CLI program = new SQL_CLI();

        /*if (program.console == null){
            System.out.println(" >> Please run this application in a command line interface, terminal or console. ");
            program.dispose();
        }else {*/
            program.run();
        //}
    }
}
