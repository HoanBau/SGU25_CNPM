#include <iostream>
#include <cmath>
using namespace std;

// Hàm giải phương trình bậc 4 dạng x^4 + b x^2 + c = 0
int solveQuartic(double a, double b, double c, double x[]) {
    if (a == 0 && b == 0 && c == 0) return -1; // vô số nghiệm
    if (a == 0 && b == 0) return 0;           // vô nghiệm
    if (a == 0) {                             // bx^2 + c = 0
        double y = -c / b;
        if (y < 0) return 0;
        x[0] = sqrt(y);
        x[1] = -sqrt(y);
        return 2;
    }
    // Phương trình bậc 2 theo y = x^2: ay^2 + by + c = 0
    double delta = b*b - 4*a*c;
    if (delta < 0) return 0;
    double y1 = (-b + sqrt(delta)) / (2*a);
    double y2 = (-b - sqrt(delta)) / (2*a);
    int count = 0;
    if (y1 >= 0) { x[count++] = sqrt(y1); x[count++] = -sqrt(y1); }
    if (y2 >= 0 && fabs(y2 - y1) > 1e-12) { x[count++] = sqrt(y2); x[count++] = -sqrt(y2); }
    return count;
}

// Hàm in nghiệm
void printRoots(int got, double roots[]) {
    if (got == -1) cout << "Infinite solutions";
    else if (got == 0) cout << "No solution";
    else {
        for (int i = 0; i < got; i++) cout << roots[i] << " ";
    }
    cout << "\n";
}

int main() {
    double a, b, c;
    double roots[4];
    int got;

    cout << "Nhap a b c de giai phuong trinh x^4 + b x^2 + c = 0: ";
    cin >> a >> b >> c;

    got = solveQuartic(a, b, c, roots);
    cout << "Ket qua: ";
    printRoots(got, roots);

    return 0;
}

//   {0,0,0},   TC1
//   {0,0,5},   TC2
//   {0,2,-8},  TC3
//   {0,3,9},   TC4
//   {1,0,-1},  TC5
//   {1,-2,1},  TC6
//   {1,5,6},   TC7
//   {1,-5,4}   TC8