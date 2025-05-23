package com.fintech.auth;

/**
 * Hello world!
 *
 */
public class App 
{
    public int add( int a, int b )
    {
        return a + b;
    }
    public static void main( String[] args )
    {
        App addNum = new App();
        int sum = addNum.add(5,10);
        System.out.println("\n--- DEBUG ---");
        System.out.println("sum of 5 + 10 is:" + sum);

        System.out.println( "Hello World!" );
    }
}
